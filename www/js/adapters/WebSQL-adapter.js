app.adapters.webdb = (function (){
    create = function(){
            app.db = openDatabase('AppDB', '1.0', 'Database para o projeto TCC', 2 * 1024 * 1024);
            app.db.transaction(function (tx) {
                tx.executeSql('CREATE TABLE IF NOT EXISTS projetos (id unique primary key,'+
                                                                    'Name NOT NULL,'     +
                                                                    'Updated,' +  
                                                                    'Description,'+ 
                                                                    'CreatedOn,'+
                                                                    'LastSaved,'+
                                                                    'BlocklyData,'+ 
                                                                    'BlocklyCode)'
                                                                   ,[],null, function(error, msg) {
                                                                        console.log(msg);
                                                                    });
            });
            app.db.transaction(function (tx) {
                tx.executeSql('CREATE TABLE IF NOT EXISTS users (id integer primary key autoincrement,'+
                                                                'Username,'+
                                                                'PasswordHash'+
                                                                ')',[],
                                                                null, function(error, msg) {
                                                                    console.log(msg);
                                                                });
            });
            app.db.transaction(function (tx) {
                tx.executeSql('CREATE TABLE IF NOT EXISTS usersProjects (userId NOT NULL,'+
                                                                        'projectId  NOT NULL,'     +
                                                                        'primary key(userId, projectId))'
                                                                        ,[],null, function(error, msg) {
                                                                            console.log(msg);
                                                                        });
            });
            app.db.transaction(function (tx) {
                tx.executeSql('CREATE TABLE IF NOT EXISTS configuration ('+
                                                                        'Name NOT NULL,'     +
                                                                        'Value , ' +
                                                                        'primary key(Name))'
                                                                        ,[],null, function(error, msg) {
                                                                             console.log(msg);
                                                                        });
            });
            return true;

    },
    drop = function(table){
         try{
            app.db.transaction(function (tx) {
                tx.executeSql('DROP TABLE '+ table,[],null
                ,function(error, msg) {
                        console.log(msg);
                });
            });
            return true;    
        }catch(err){
            console.log(err.message);
            return false;
        }
    },
    insert = function(table, fields, values, params){
        try{
            var query = 'INSERT INTO '+table+' ('+fields+') VALUES ('+values+')'; 
            app.db.transaction(function(tx) {
                tx.executeSql(query,params,null, 
                    function(error, msg) {
                             console.log("Error in Webdb Insert Function: "+ msg.message);
                    });
            });
            return true;
        }
        catch(err){
            console.log(err.message);
            return false;
        }
    },
    update = function(table, fields, condition, params){
           try{
                var query = 'UPDATE '+table+' SET '+fields;
                if (condition != '' && condition != null) {
                    query = query + ' WHERE ' + condition;
                }
                if (params === null) {
                    params = [];
                }
                app.db.transaction(function (tx) {
                    tx.executeSql(query, params,null,
                        function(error, msg) {
                               console.log("Error in Webdb Update Function: "+ msg.message);
                        });
                });
                return true;
           }
           catch(err){
               console.log(err.message);
               return false;
           }
    },
    del = function(table, condition, params){
           try {
                var query = 'DELETE FROM ' + table;
                if (condition != '' && condition != null) {
                    query = query + ' WHERE ' + condition;
                }
                if (params === null) {
                    params = [];
                }
                app.db.transaction(function(tx) {
                    tx.executeSql(query, params,null,
                        function(error, msg) {
                               console.log("Error in Webdb Del Function: "+ msg.message);
                        });
                });
                return true;
            } catch(err) {
                console.log(err.message);
                return false;
            }
    },
    select = function(fields, table, condition, params){
        
            try {
                var deferred = $.Deferred();
                var results = [];
                var query = 'SELECT ' + fields + ' FROM ' + table;
                if (condition != '' && condition != null) {
                    query = query + ' WHERE ' + condition;
                }
                if (params === null) {
                    params = [];
                }
                app.db.transaction(function(tx) {
                    tx.executeSql(query, params, function(tx, results) {
                        var res = [];
                        var len = results.rows.length, i;
                        for ( i = 0; i < len; i++) {
                            res[i] = results.rows.item(i);
                        }
                        deferred.resolve(res);
                    }, function(error,msg) {
                        console.log("Error in Webdb Select Function: "+ msg.message);
                        deferred.reject("Transaction Error: " + error.message);
                    });
                });
                return deferred.promise();
            } catch(err) {
                alert(err.message);
                return false;
            }
    },
    selectJoin = function(fields, table1, table2, on, condition, params){
            try {
                var deferred = $.Deferred();
                var results = [];
                var query = 'SELECT ' + fields + 
                            ' FROM ' + table1 +
                            ' JOIN '+ table2 +
                            ' ON ' + on;
                
                if (condition != '' && condition != null) {
                    query = query + ' WHERE ' + condition;
                }
                if (params === null) {
                    params = [];
                }
                app.db.transaction(function(tx) {
                    tx.executeSql(query, params, function(tx, results) {
                        var res = [];
                        var len = results.rows.length, i;
                        for ( i = 0; i < len; i++) {
                            res[i] = results.rows.item(i);
                        }
                        deferred.resolve(res);
                    }, function(error,msg) {
                        console.log("Error in Webdb Select JOIN Function: "+ msg.message);
                        deferred.reject("Transaction Error: " + error.message);
                    });
                });
                return deferred.promise();
            } catch(err) {
                alert(err.message);
                return false;
            }
    };

    return {
        create: create,
        drop: drop,
        select: select,
        del : del,
        update : update,
        insert : insert,
        selectJoin : selectJoin
    };
}());

app.adapters.webdb.project = (function () {
        var table = 'projetos',
        
        insert = function (model){
            var fields = 'id, Name, Updated, Description, CreatedOn, LastSaved, BlocklyData, BlocklyCode';
            var values = '?,?,?,?,?,?,?,?';
            var params = [model.get("id"), model.get("Name"), false, model.get("Description"), model.get("CreatedOn"), model.get("LastSaved"), null, null];
            return app.adapters.webdb.insert(table, fields, values, params);
        },
        update = function (model){
            var fields = 'Name = ?, Updated = ?, Description = ?, LastSaved = ?, BlocklyData = ?, BlocklyCode = ?';
            var params = [model.get("Name"),model.get("Updated"),model.get("Description"),model.get("LastSaved"), 
                          model.get("BlocklyData"), model.get("BlocklyCode"), model.get("id")];
            return app.adapters.webdb.update(table, fields, 'id = ?', params);
        },
        deleteAll = function(){
            return app.adapters.webdb.del(table); 
        },
        deleteProject = function(id){
            return app.adapters.webdb.del(table,'id = ?', [id]);
        },
        
        findById = function (id) {
            return app.adapters.webdb.select('*',table,'id = ?', [id]);
        },

        findByName = function (searchKey) {
            return app.adapters.webdb.select('*', table, 'Name = ?', [searchKey]);
        },
        findAllUpdated = function () {
            return app.adapters.webdb.select('*', table, 'Updated = ?', [true]);
        },
        findAllWithCode = function () {
            return app.adapters.webdb.select('*', table, 'BlocklyCode <> ?', [""] );
        },
        findAll = function() {
            return app.adapters.webdb.select('*',table);
        }, 
        
        projects = []; 

    // The public API
    return {
        findById: findById,
        findByName: findByName,
        findAllWithCode:findAllWithCode,
        findAllUpdated:findAllUpdated,
        findAll: findAll,
        insert: insert,
        update: update,
        deleteProject: deleteProject,
        deleteAll: deleteAll
    };
    

}());

app.adapters.webdb.user = (function () {
        var table = 'users';
    
        findByUsername = function (username) {
            return app.adapters.webdb.select('*',table,'Username = ?',[username]);
        },
        findById = function (id) {
            return app.adapters.webdb.select('*',table,'id = ?',[id]);
        },
        findAll = function() {
            return app.adapters.webdb.select('*',table);
        }, 
        update = function (model){
            var fields = 'Username = ?, PasswordHash = ?';
            var params = [model.get("Username"),model.get("PasswordHash"), model.get("id")];
            return app.adapters.webdb.update(table,fields, 'id = ?', params);
        },
        
        deleteUser = function(id){
            return app.adapters.webdb.del(table,'id = ?', [id]);  
        },
        deleteAll = function(){
            return app.adapters.webdb.del(table);   
        },
        insert = function (model){
            var fields = 'Username, PasswordHash';
            var values = '?,?';
            var params = [model.get("Username"), model.get("PasswordHash")];
            return app.adapters.webdb.insert(table, fields, values, params);
        };

    // The public API
    return {
        findByUsername: findByUsername,
        findById: findById,
        findAll: findAll,
        insert: insert,
        update: update,
        deleteUser: deleteUser,
        deleteAll: deleteAll
    };
}());

app.adapters.webdb.userProject = (function () {
    var table = 'usersProjects',
    
    findAll = function() {
            return app.adapters.webdb.select('*',table);
    }, 
    findByUserId = function (id) {
           return app.adapters.webdb.selectJoin('projetos.*', 'projetos', table, 
                                                'projetos.id = usersProjects.ProjectId', 
                                                'usersProjects.UserId = ?', [id]);
    },
    findByProjectId= function (id) {
            return app.adapters.webdb.select('*', table, 'ProjectId = ?', [id]);
    },
    find = function (userId, projectId) {
             return app.adapters.webdb.selectJoin('projetos.*', 'projetos', table, 
                                                'projetos.id = usersProjects.ProjectId', 
                                                'usersProjects.UserId = ? and usersProjects.ProjectId = ?', 
                                                [userId, projectId]);
    },
    insert = function (userId,projectId){
            var fields = 'UserId, ProjectId';
            var values = '?,?';
            var params = [userId, projectId];
            return app.adapters.webdb.insert(table, fields, values, params);
    },
    
    deleteUser = function(id){
            return app.adapters.webdb.del(table, 'UserId = ?', [id]);
    },
    deleteProject = function(id){
            return app.adapters.webdb.del(table, 'ProjectId = ?', [id]);
    },
    deleteOne = function(userId, projectId){
            return app.adapters.webdb.del(table, 'UserId = ?, ProjectId = ?', [userId, projectId]);
    },
        
    deleteAll = function(){
            return app.adapters.webdb.del(table);
    };
    
    return {
        findByUserId: findByUserId,
        findByProjectId: findByProjectId,
        findAll: findAll,
        find: find,
        insert: insert,
        update: update,
        deleteByUser: deleteUser,
        deleteByProject: deleteProject,
        deleteAll: deleteAll,
        deleteOne: deleteOne
        
    };
    
}());

app.adapters.webdb.configuration = (function () {
    var table = 'configuration',
    
    findAll = function() {
            return app.adapters.webdb.select('*',table);
    }, 
    findByName = function (name) {
            return app.adapters.webdb.select('Value', table, 'Name = ?', [name]);
    },
    
    findLastLogged = function(){
            return app.adapters.webdb.selectJoin('users.*', 'users', table, 
                                                 'users.Username = configuration.Value');
    },
    insert = function (name, value){
            var fields = 'Name, Value';
            var values = '?,?';
            var params = [name,value];
            return app.adapters.webdb.insert(table, fields, values, params);
    },
    update = function (name, value){
            var fields = 'Value = ?';
            var params = [value, name];
            return app.adapters.webdb.update(table,fields, 'Name = ?', params);
    },
    
    deleteConfig = function(name){
            return app.adapters.webdb.del(table, 'Name = ?', [name]);
    },
    deleteAll = function(){
            return app.adapters.webdb.del(table);
    };
    
    return {
        findAll: findAll,
        findByName: findByName,
        findLastLogged:findLastLogged,
        insert: insert,
        update: update,
        deleteConfig: deleteConfig,
        deleteAll: deleteAll
    };
    
}());