exports.handler = function(event, context, callback) {
    console.log(JSON.stringify(event), JSON.stringify(context), "i am jamie");
    callback("hello world");
}