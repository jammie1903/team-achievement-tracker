exports.handler = function(event, context, callback) {
    console.log(event, context, "i am jamie");
    callback("hello world");
}