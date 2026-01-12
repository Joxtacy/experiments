# LaTeX

## Run with docker compose

```sh
docker compose run --rm latex arara -v essay.tex
```

or use `fswatch`

```sh
fswatch -o <yourfile>.tex | xargs -n1 -I{} docker compose run --rm --no-TTY latex arara -v <yourfile>.tex
```
