const express = require('express');
const index = express.Router();
const CatchIndex = require('../model/Catch_Index');
const axios = require('axios');

index.get('/', (req, res) => {
    title = 'Home';
    let DateNow = Date.now();
    let DateNowYear = new Date(DateNow).getFullYear();
    let DateNowMonth = new Date(DateNow).getMonth() + 1;
    let DateNowDay = new Date(DateNow).getDate();
    let DateNowString = DateNowYear + '' + DateNowMonth + '' + DateNowDay;

    (async () => {
        let findOneData = CatchIndex.findOne({time: DateNowString});
        let data = await findOneData.exec();
        // check data is null or not
        if (data == null) {
            DataSchema()
        }else{
            // check data is null or not
            if (data.time == null) {
                DataSchema()
            }else{
                // check data is null or not
                if (data.time == DateNowString) {
                    res.render('index', {
                        title: title,
                        dataAnime: data.data_record
                    });
                    console.log(`load data from database`);
                }else{
                    DataSchema()
                }
            }
        }
    })();

    async function SaveSchema(after) {
        let newCatchIndex = new CatchIndex({
            time: DateNowString,
            data_record: after
        })
        await newCatchIndex.save();
    }
    async function DataSchema() {
        try {
            const response = await axios.get('https://api.jikan.moe/v4/seasons/now');
            const data = await response.data.data;
            let after = []
            await data.map(element => {
                after.push({
                    title: element.title,
                    image: element.images.jpg.image_url,
                    url: element.url,
                    mal_id: element.mal_id,
                });
            });
            await SaveSchema(after);
            console.log(`${DateNowString} is equal to ${data.time}`);
            console.log(`load data from api`);
            res.render('index', {title: title, dataAnime: after});
        } catch (error) {
          console.error(error);
        }
    }
});

module.exports = index;