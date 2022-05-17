const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/ids/:id', async (req, res) => {
    try {
        const { id } = req.params
        if (!id || id.length !== 10) {
            return res.status(400).send({
                msg: 'Invalid ID'
            })
        }
        await axios.get(`http://nisit-ku.ku.ac.th/WebForm_Index_Report.aspx?stdid=${id}&h=0`)
                    .then(({ data }) => {
                        const transcript = data.split('<span id=\"LabelSTD_IDNO\">')[1].split('<table style="WIDTH: 820px; HEIGHT: 75px"')[0]
                        const lines = transcript.split('<font color="Blue">')
                        let countID = 0
                        let student = []
                        lines.map(line => {
                            const lineSplit = line.split('</font>')
                            const lineText = lineSplit[0]
                            if (lineText.length > 1) {
                                if (lineText != '' || lineText != null || lineText != undefined) {
                                    countID++
                                    student.push({
                                        id: countID,
                                        text: lineText,
                                    })
                                }
                            }
                        } );
                        return res.status(200).json(student)
                    });
    } catch (error) {
        res.status(500).send({
            msg: 'Server Error',
            error: error.message
        })
    }
});

module.exports = router;