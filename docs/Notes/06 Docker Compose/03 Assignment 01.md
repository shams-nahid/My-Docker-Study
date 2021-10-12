### Running a Drupal Site Using Docker Compose

---

In this assignment, we will run a `Drupal` site with `postgres` database. With `docker-compose`

- We need two container `drupal` and `postgres`
- By default the `drupal` run on port `80`, but we make sure from host machine we can access them from port `8080`
- To persist the content of the site, we will do `Named Volume` mapping for the drupal site
- For `postgres` we will pass `Database Name`, `Database User` and `Database Password`. They will be required when we have to install `drupal` site from the browser.

Create a `docker-compose.yml` file,

```bash
touch docker-compose.yml
```

Our `docker-compose.yml` file should be as follows,

```yml
version: '3.1'
services:
  drupal:
    image: drupal:9.1.6
    ports:
      - '8080:80'
    volumes:
      - drupal-modules:/var/www/html/modules
      - drupal-profiles:/var/www/html/profiles
      - drupal-sites:/var/www/html/sites
      - drupal-themes:/var/www/html/themes
  postgres:
    image: postgres:13.2
    environment:
      - POSTGRES_DB=drupal
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
volumes:
  drupal-modules:
  drupal-profiles:
  drupal-sites:
  drupal-themes:
```

Now run the containers,

```docker
docker-compose up
```

After all the containers spined up, we can go to `http://localhost:8080/`. To set up, we have to select the `postgres` as it is using underline. Also, `DB Name`, `DB User` and `DB Password` should be same as the `environments` we passed through the `docker-compose.yml` file.

By default the `drupal` expect the database at `localhost`, but our database `DNS` name is `postgres`. From the `Advance Options` we have to also update the database host name.

To clean up all the containers along with the volumes, we can use

```docker
docker-compose down -v
```
