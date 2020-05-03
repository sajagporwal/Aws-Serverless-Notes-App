/**
 Route: PATCH /note
 */

const AWS = require('aws-sdk');
AWS.config.update({region:'us-east-2'});

const dynamodb = new AWS.DynamoDB.DocumentClient();
const table_name = process.env.NOTES_TABLE;
const util = require('../util');
const moment = require('moment');

exports.handler = async event =>{
    try{
        let item = JSON.parse(event.body).Item;
        item.user_id = util.getUserId(event.headers);
        item.user_name = util.getUserName(event.headers);
        item.expires = moment().add(90,'days').unix();

        let data = dynamodb.put({
            TableName: table_name,
            Item: item,
            ConditionExpression: '#t = :t',
            ExpressionAttributeNames:{
                '#t': 'timestamp'
            },
            ExpressionAttributeValues:{
                ':t': item.timestamp
            }
                     }).promise()

        return{
            statusCode: 200,
            headers: util.getResponseHeaders(),
            body:JSON.stringify(item)
        }
    }
    catch(err){
        console.log('Error: '+err);
        return{
            statusCode: err.statusCode?err.statusCode:500,
            headers: util.getResponseHeaders(),
            body: JSON.stringify({
                                     error: err.name?err.name:'Exception',
                                     message: err.message?err.message:'Unknown error'
                                 })
        }
    }
}
