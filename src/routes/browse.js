const express = require('express');
const rount = express.Router();
const axios = require('axios');
const model_logs_search = require('../model/Logs_Search');

rount.get('/', (req, res) => {
    title = 'Search';
    let dataAnime = [];
    url = "";
    clean_search = "";
    clean_rate = "";
    clean_status = "";
    clean_type = "";
    clean_sort = "&order_by=popularity";

    if(req.query.search != undefined){
        if(req.query.search != "") {
            clean_search = `&q=${req.query.search}`;
        }
    }
    if(req.query.rate != undefined){
        if(req.query.rate != "no" ) {
            clean_rate = `&rated=rx`;
        }
    }
    if(req.query.status != undefined){
        if(req.query.status != "all" ) {
            clean_status = `&status=${req.query.status}`;
        }
    }
    if(req.query.type != undefined){
        if(req.query.type != "all" ) {
            clean_type = `&type=${req.query.type}`;
        }
    }
    if(req.query.sort != undefined){
        if(req.query.sort != "all" ) {
            clean_sort = `&order_by=${req.query.sort}`;
        }
    }

    url = `https://api.jikan.moe/v4/anime?${clean_search}${clean_rate}${clean_status}${clean_type}${clean_sort}&limit=12`;
    
    if(req.query.search == undefined && req.query.rate == undefined && req.query.status == undefined && req.query.type == undefined && req.query.sort == undefined){
        url = `https://api.jikan.moe/v4/seasons/now?limit=12`;
    }

    axios.get(url)
    .then(response => {
        const data = response.data.data;
        dataAnime = data.map(anime => {
            var newSearch = new model_logs_search();
            newSearch.Search = anime.title;
            const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            newSearch.user = ip;
            newSearch.date = new Date();
            newSearch.idAnime = anime.mal_id;
            model_logs_search.findOne({Search: anime.title})
            .then(data => {
                if(data == null){
                    newSearch.save();
                }
            })
            return {
                image: anime.images.jpg.image_url,
                title: anime.title,
                id: anime.mal_id,
                status: anime.status,
                season: anime.season,
                rating: anime.rating,
                episodes: anime.episodes,
                search: {
                    clean_search,
                    clean_rate,
                    clean_status,
                    clean_type,
                    clean_sort
                }
            }
        });
        res.render('Search', { title, dataAnime });
    })
    
});

rount.get('/res', (req, res) => {
    model_logs_search.find({}, (err, data) => {
        if(err) {
            res.json(err);
        } else {
            res.json(data);
        }
    });
})

rount.get('/del', (req, res) => {
    // model_logs_search.deleteMany({}, (err, data) => {
    //     if(err) {
    //         res.json(err);
    //     } else {
    //         res.json(data);
    //     }
    // });
    res.json({
        message: "Can't delete date from database"
    });
});

rount.get('/add-to-card/:idAnime', (req, res) => {
    model_logs_search.findOne({idAnime: req.params.idAnime}, (err, data) => {
        // check find one if found 
        console.log(req.params.idAnime);
        if(err) {
            res.json(err);
        }
        if(data != null){
            res.json({
                message: "Anime already in your card",
                data: {
                    Name: data.Search,
                    idAnime: data.idAnime
                },
                status: true
            });
        }else if(data == null){
            res.json({
                message: "not found",
                status: false
            });
        }
    });

});

module.exports = rount;