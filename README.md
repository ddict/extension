# @ddict/extension

## setup

modify the `.npmrc` file

replace `GITHUB_TOKEN` with your [Github access token](https://docs.github.com/en/free-pro-team@latest/github/authenticating-to-github/creating-a-personal-access-token) with `read:packages` permission which allows `Download packages from github package registry`.

```sh
yarn
```

## development

```sh
yarn watch
```

## build

```sh
yarn build
```

The extension is the `build` folder.

## note

-   parcel process the `ga.js` file that makes google analytics scripts stop working. so we have to replace it after build.
