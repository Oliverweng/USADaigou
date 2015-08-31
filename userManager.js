module.exports.findById = function (id, users, cb) {
    process.nextTick(function() {
        var idx = id - 1;
        if (users[idx]) {
            cb(null, users[idx]);
        } else {
            cb(new Error('User ' + id + ' does not exist'));
        }
    });
}

module.exports.findByUsername = function (username, users, cb) {
    process.nextTick(function() {
        for (var i = 0, len = users.length; i < len; i++) {
            var record = users[i];
            if (record.username === username) {
                return cb(null, record);
            }
        }
        return cb(null, null);
    });
}