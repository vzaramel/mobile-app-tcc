app.adapters.project = (function () {

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
                                                                    'BlocklyCode)');
            });
            return true;

        },
        deleteAll = function(){
            app.db.transaction(function (tx) {
                    tx.executeSql('DELETE FROM projetos ');
            });
            return true;  
        },
        insert = function (model){
            app.db.transaction(function(tx) {
                tx.executeSql('INSERT INTO projetos (id, Name, Updated, Description, CreatedOn, LastSaved, BlocklyData, BlocklyCode)' + 
                              'VALUES (?,?,?,?,?,?,?,?)', 
                              [model.get("id"), model.get("Name"), false, model.get("Description"), model.get("CreatedOn"), model.get("LastSaved"), null, null]);
            });
            return true;
        },
        
        update = function (model){
           app.db.transaction(function (tx) {
                    tx.executeSql('UPDATE projetos SET Name = ?, Updated = ?, Description = ?, LastSaved = ?, BlocklyData = ?, BlocklyCode = ?' +
                                  'WHERE id = ?', [model.get("Name"),model.get("Updated"),model.get("Description"),
                                                   model.get("LastSaved"), model.get("BlocklyData"), model.get("BlocklyCode"), model.get("id")]);
            });
            return true;
        },
        
        deleteProject = function(id){
            app.db.transaction(function (tx) {
                    tx.executeSql('DELETE FROM projetos ' +
                                  'WHERE id = ?', id);
            });
            return true;  
        },
        
        findById = function (id) {
            var deferred = $.Deferred();
            var project = null;
            app.db.transaction(function(tx) {
                tx.executeSql('SELECT * FROM projetos Where id = ?', [id], function(tx, results) {
                    var result = results.rows.length === 1 ? results.rows.item(0) : null;
                    
                    deferred.resolve(result);
                },function (error) {
                        deferred.reject("Transaction Error: " + error.message);
                });
            });
            return deferred.promise();
        },

        findByName = function (searchKey) {
            var deferred = $.Deferred();
            var results = [];
            app.db.transaction(function(tx) {
                tx.executeSql('SELECT * FROM projetos Where Name = ?', [searchKey], function(tx, results) {
                    deferred.resolve(results.rows.item);
                    var len = results.rows.length, i;
                    for ( i = 0; i < len; i++) {
                        projects[i] = results.rows.item(i);
                    }
                    deferred.resolve(projects);
                },function (error) {
                        deferred.reject("Transaction Error: " + error.message);
                });
            });
            return deferred.promise();
        },

        
        findAll = function() {
            var deferred = $.Deferred();
            app.db.transaction(function(tx) {
                tx.executeSql('SELECT * FROM projetos', [], function(tx, results) {
                    var len = results.rows.length, i;
                    for ( i = 0; i < len; i++) {
                        projects[i] = results.rows.item(i);
                    }
                    deferred.resolve(projects);
                },function (error) {
                        deferred.reject("Transaction Error: " + error.message);
                });
            });
            return deferred.promise();
        }, 
        
        projects = []; 


    // The public API
    return {
        create: create,
        findById: findById,
        findByName: findByName,
        findAll: findAll,
        insert: insert,
        update: update,
        deleteProject: deleteProject,
        deleteAll: deleteAll
    };
    

}());