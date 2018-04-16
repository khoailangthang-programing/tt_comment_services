
module.exports = {

    readableTime: function (timestamp) {
        var currentTime = new Date();
        currentTimestamp = Math.floor(currentTime.getTime()/1000);
        var time = currentTimestamp - timestamp;
        var readable = 0;
        if (time >= 0 && time < 60) {
            readable = time + " giây trước";
        } else if (time >= 60 && time < 3600) {
            readable = Math.floor(time/60) + " phút trước";
        } else if (time >= 3600 && time < 86400) {
            readable = Math.floor(time/3600) + " giờ trước";
        } else {
            time = new Date(timestamp*1000);
            readable = time.getDate() + "/" + time.getMonth() + "/" + time.getFullYear();
        }
        return readable;
    },

};