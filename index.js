#!/usr/bin/env node
/* 

  MIGRATOR

  A migration utility for Geddy.js

  Takes a command like this:
  migrator add user string name

  or like this:
  ./migrator remove user string name

  Where "add/remove" is the type of migration
  (adding/removing a column from the table)

  Where "user" is the model to perform the migration on.

  Where "string" is the model data type, used when adding.

  Where "name" is the column name to add/remove.

*/

var exec = require('child_process').exec;
var fs = require('fs');
var path = require('path');
var mustache = require('mustache');

if(process.argv[2] !== "add" && process.argv[2] !== "remove") throw new Error("Must add or remove");

var add = process.argv[2] === "add" ? true : false;
var modelName = process.argv[3];
var dataType = process.argv[4];
var columnName = process.argv[5];

var migrationName = san(process.argv[3]) + san(process.argv[2]) + san(process.argv[5]) + san(process.argv[4]);

var camelName = migrationName[0].toUpperCase() + migrationName.slice(1);
var templateFill = {
  tableName: modelName,
  dataType: dataType,
  columnName: columnName,
  migrationName: camelName
}

generateMigration(function(err, stdout, stderr){
  if(err){
    console.log(err);
    return err;
  }
  editFile();
  runMigration();
})

function generateMigration(callback){
  console.log("Generating migration "+migrationName);
  var child = exec('geddy gen migration '+migrationName, callback);
}

function editFile(){
  var files = fs.readdirSync(path.join(process.cwd(), 'db', 'migrations'));
  files.sort();

  // Load the add/remove template accordingly:
  var template = fs.readFileSync(path.join(__dirname, 'templates', process.argv[2])).toString();

  var migration = mustache.render(template, templateFill);
  console.log("Writing migration "+files[files.length-1]);
  fs.writeFileSync(path.join(process.cwd(), 'db', 'migrations', files[files.length-1]), migration);

}

function runMigration(){
  console.log("Running migration");
  var child = exec('geddy jake db:migrate');
}

function san(string){

  var result = '';
  for(var i = 0; i < string.length; i++){
    if(string[i]!== '-'
      && string[i] !== '_'){
      result+=string[i];
    }
  }
  return result;

}