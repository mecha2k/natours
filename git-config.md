#Git command

- First time git setup

```
git config --list --show-origin
git config --global user.name "John Doe"
git config --global user.email johndoe@example.com
git config --list
```

- Getting a git

```
git init

git clone https://github.com/libgit2/libgit2
git status
```

- Committing

```
git add --all
git status
git commit -m "message here"

git push origin master
git remote show origin
```

- Getting help

```
git add -h
git help <verb>
```
