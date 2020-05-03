/**
 Route: DELETE /note/t/{timestamp}
 */

const AWS = require('aws-sdk');
AWS.config.update({region:'us-east-2'});

const dynamodb = new AWS.DynamoDB.DocumentClient();
const table_name = process.env.NOTES_TABLE;
const util = require('../util');

exports.handler = async event =>{
    try{
        let timestamp = parseInt(event.pathParameters.timestamp);
        let params = {
            TableName: table_name,
            Key:{
                user_id: util.getUserId(event.headers),
                timestamp: timestamp
            }
        }

        await dynamodb.delete(params).promise();

        return{
            statusCode: 200,
            headers: util.getResponseHeaders()
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
