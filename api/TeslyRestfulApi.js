import express from 'express'
import http from 'http'
import {getDocument,insertDocuments,updateDocuments,getCollection} from './mongo.mjs'
import fs from 'fs'
import colors from 'colors'
import bodyParser from 'body-parser'

const app = express()
const config = JSON.parse(fs.readFileSync('./api/config.json'));
app.use(bodyParser.json());       
app.use(bodyParser.urlencoded({ 
  extended: true
})); 
const server = http.createServer(app)
export function notification(str) {
  console.log(`${str}`.green)  
}
export function warning(warn) {
    console.log(`${warn}`.yellow)  
}
export function error(err) {
    console.log(`${err}`.red)  
}
server.listen(config.port,() => {
    console.log(` [Api] ${config.port} portunda api aktif... `.cyan)
}) 
export function Api() {
    app.get('/',(req,res) => {
        res.send('Welcome To Restful Api')
    })
    app.get('/:pass/:type/:collection/:fieldname/:fieldvalue',(req,res) => {
        if(req.params.type == "get"){
            if(req.params.pass == config.apiPass) {
                getDocument(req.params.fieldname,req.params.fieldvalue,req.params.collection,(data) => {
                        let docs = JSON.parse(data)
                        res.json(docs[0])
                    })
            }else {
                res.send('fuck u lamer')
            }
        }else {
            res.send('Nothing Type')
        }
    })
    app.get('/:pass/:type/:collection',(req,res,next) => {
        if(req.params.type == "getcollection") {
            if(req.params.pass == config.apiPass) {
                getCollection(req.params.collection,(data) => {
                    let docs = JSON.parse(data)
                    res.json(docs)
                })
            }else {
                res.send('fuck u lamer')
            }
        }      
    })
    app.post('/:pass/insert/:colletion/',(req,res,next) => {
        if(req.params.pass == config.apiPass){
            console.log(req.body)
            insertDocuments(JSON.stringify(req.body),req.params.colletion)  
        }else {
            res.send('fuck u lamer')
        }
    })
    app.post('/:pass/update/:collection/',(req,res,next) => {
        if(req.params.pass == config.apiPass) {
            updateDocuments(JSON.stringify(req.body),req.params.collection,(res) => {
                if (!res.success) {
                    error("Failed to update any documents.")
                    return new Error('Failed to update any documents.');
                }
            })
        }else {
            res.send('fuck u lamer')
        }
    })
}