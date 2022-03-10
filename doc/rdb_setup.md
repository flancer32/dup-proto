# Setup backend database

`DupChat` app uses [knex](https://knexjs.org/) package to store data on the backend. I've tested 3 RDBMS with the app:

* SQLite
* MySQL/MariaDB
* PostgreSQL

Connectors for these 3 RDBMS are included in application's `package.json` and you can use any RDBMS to test `DupChat`.

## RDB connector configuration

Local configuration is stored in `./cfg/local.json` file:

```json
{
  "@flancer32/dup-proto": {
    "db": {}
  }
}
```

Structure of configuration options in `@flancer32/dup-proto.db` is the same as structure of
knex [configuration object](https://knexjs.org/#Installation-client).

### SQLite

The easiest way is to use SQLite DB.

In-memory:

```json
{
  "@flancer32/dup-proto": {
    "db": {
      "client": "sqlite3",
      "connection": {
        "filename": ":memory:"
      },
      "useNullAsDefault": true
    }
  }
}
```

In-file:

```json
{
  "@flancer32/dup-proto": {
    "db": {
      "client": "sqlite3",
      "connection": {
        "filename": "/.../dup-proto/var/db.sqlite"
      },
      "useNullAsDefault": true
    }
  }
}
```

## MySQL/MariaDB

```json
{
  "@flancer32/dup-proto": {
    "db": {
      "client": "mysql2",
      "connection": {
        "database": "...",
        "host": "127.0.0.1",
        "password": "...",
        "user": "..."
      }
    }
  }
}
```

Statements to create and setup DB:

```shell
$ sudo mysql
...
> CREATE DATABASE dup;
> CREATE USER dup@localhost IDENTIFIED BY '...';
> GRANT ALL PRIVILEGES ON dup.* TO dup@localhost;
> FLUSH PRIVILEGES;
```

## PostgreSQL

```json
{
  "@flancer32/dup-proto": {
    "db": {
      "client": "pg",
      "connection": {
        "database": "...",
        "host": "127.0.0.1",
        "password": "...",
        "user": "..."
      }
    }
  }
}
```

Statements to create and setup DB:

```shell
$ sudo -u postgres psql
... 
postgres=# create user dup password '...';
postgres=# create database dup owner dup;
```
