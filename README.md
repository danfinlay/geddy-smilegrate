# Smilegrate
### Stop frowning during migrations!

Smilegrate is a simple command line utility for running migrations in the [Geddy.js](geddyjs.org) framework for Node.js.

Install is easy if you have Node and NPM installed:
```
npm i -g smilegrate
```

Smilegrate is for simple migrations, like adding or removing a single column from a table.  Such a migration might be performed to add a "name" string to the user table like so:

```
$ smilegrate add user string name
```

Or, to remove the same row:

```
$ smilegrate remove user string name
```
In these examples, "string" could be replaced with any datatype that [Model](https://github.com/geddy/model)(Geddy's ORM) supports.

## Under the hood

Smilegrate is basically performing three functions for you: 

- Generating a migration template using `geddy gen migration`.
- Populating that migration file with the bare minimum to perform what you requested.
- Running the migration using the `geddy jake db:migrate` command.

