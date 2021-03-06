/*
 * Base Dependencies
 */


/*
 * Server Dependencies
 */
var debug = require('debug')('smartdo:middleware:helper');
var ServerError = require('../errors/server-error');
var uuid = require('uuid');
var Moment = require('moment');
var async = require('async');

var InvincibleDB = require('../models/invincible');
var User = InvincibleDB.getModel('user');
var Role = InvincibleDB.getModel('role');
var Team = InvincibleDB.getModel('team');

var Shared = require('../../shared/');
var ERROR_CODE = Shared.ERROR;
var MESSAGE = Shared.MESSAGE;

/*
 * UModules Dependencies
 */

module.exports = {
    // 找出所有小组信息 转成数组存到 req.teams
    team_list: function(req, res, next) {
        var teamsJson = {};
        var teamsArr = [];

        async.series([
            // 遍历所有小组信息
            function (callB) {
                Team.find({}, function(err, findTeams) {
                    if (err) {
                        callB(ERROR_CODE.DB_ERROR);
                        return;
                    }

                    findTeams.forEach(function(row) {
                        var id = row._id.toString();

                        teamsJson[id] = {
                            _id: id,
                            name: row.name,
                            leader: {},
                            members: [],
                            createdAt: row.createdAt,
                            updatedAt: row.updatedAt
                        };
                    });

                    callB(null);
                });
            },
            // 遍历所有用户信息
            function (callB) {
                User.find({})
                    .populate('role')
                    .exec(function(err, findUsers) {
                        if (err) {
                            callB(ERROR_CODE.DB_ERROR);
                            return;
                        }

                        findUsers.forEach(function(row) {
                            if (row.role == null || typeof row.role != "object") {
                                return;
                            }

                            if (row.team == null) {
                                return;
                            }

                            var roleInfo = row.role;
                            var teamId = row.team.toString();
                            var theTeam = teamsJson[teamId];

                            if (theTeam == null) {
                                return;
                            }

                            // 记录类目主管和专员的信息 其他类型的用户就不记录
                            switch (roleInfo.type) {
                                case "leader": {
                                    theTeam.leader = {
                                        _id: row._id.toString(),
                                        account: row.account,
                                        name: row.name
                                    };
                                    break;
                                }
                                case "member": {
                                    theTeam.members.push({
                                        _id: row._id.toString(),
                                        account: row.account,
                                        name: row.name
                                    });
                                    break;
                                }
                                default : {
                                    break;
                                }
                            }
                        });

                        callB(null);
                    });
            }
        ], function(err, result) {
            if (err) {
                res.error(err);
                return;
            }

            // 将teamJson信息转换成数组
            for (var key in teamsJson) {
                teamsArr.push(teamsJson[key]);
            }

            // 存到req中
            req.teams = teamsArr;

            next();
        })
    },

    // 当前用户可以管理的所有角色id列表 存到 req.subordinate []
    role_management: function(req, res, next) {
        var agent = req.agent;
        var role = agent.role;

        if (role.management[0] == "*") {
            Role.find({}, function(err, findResults) {
                if (err) {
                    res.error(err);
                    return;
                }

                req.subordinate = [];
                findResults.forEach(function(row) {
                    if (row.type == "admin") {
                        return;
                    }

                    req.subordinate.push(row._id);
                });

                next();
            });
            return;
        }

        req.subordinate = role.management;
        next();
    },

    // 部门列表 存到 req.departments
    department_list: function(req, res, next) {
        req.departments = [
            "运营中心",
            "供应链部",
            "市场部",
            "技术部",
            "财务部",
            "人力资源部",
            "产品部",
            "行政部",
            "物流部",
            "总裁办",
            "访客"
        ];
        next();
    }
};
