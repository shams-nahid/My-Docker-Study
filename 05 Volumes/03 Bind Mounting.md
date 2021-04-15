### Bind Mounting

---

Bind mounting is mapping mapping host files and directories into container files and directories. It skips the union file system and on delete a container, do not erase the data from host machine.

If we have files that is mapped to the host files and also exist in the container, in this case the host files will be used.

To test the `Bind Mounting` we will use the `nginx` image. First create a file `index.html` as follows,

```bash
touch index.html
```

Make our `index.html` file as simple as possible,

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Docker Volumes Testing</title>
  </head>
  <body>
    Hello From Bind Mounting
  </body>
</html>
```

Now create a container of the `nginx` image to use this `index.html`,

```docker
docker container run -d --name nginx -p 80:80 -v "$(pwd)":/usr/share/nginx/html nginx
```

Now if we browse `http://localhost/` from browser, we should see the the `nginx` server is serving our `index.html` instead of the container itself.

> If you are in the windows machine, instead of `"$(pwd)"`, for PowerShell use `${pwd}` and for cmd.exe "Command Prompt use: `%cd%`
