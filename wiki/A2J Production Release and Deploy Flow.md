# A2J Production Release and Deploy Flow 
When deploying the A2J App Suite (Author, Viewer, DAT) this is the ideal flow to make sure all applications are up to date. This flow builds up from the lowest dependencies to the highest.

Start with the [A2J Deps](https://github.com/CCALI/a2jdeps) as all the other A2J Apps depend on it. While changes to the A2J Deps package may only really affect one of the parent apps, making sure they are all updated or at least able to receive the latest updated Deps package. For example, in package.json, using the ^ to allow Minor and Patch updates.

## A2J Deps Release:
- Change to the `develop` branch if not already on it.
- Do a `git pull` to make sure you are up to date with all changes.
- Make sure you are logged into `npm`. In your terminal type `npm whoami` and be sure you have permissions to do npm releases with that account for this repo.
- Run `npm run release:<semverType>` where `<semverType>` could be either `patch`, `minor`, or `major`. Example, for a bug fix that is not a breaking change, you would run `npm run release:patch`.
- This will execute the release script, running the tests first (a release will not happen with failed tests)
- Once the npm release is successful, do a pull request from `develop` into `production` to keep it in parity with the npm release.
- OPTIONAL -> Update Author, Viewer and/or A2J DAT to this new release as needed. aka `npm install @caliorg/a2jdeps@latest` which will update both the package.json file and the package-lock.json to this latest release version in the respective codebase.

## A2J Viewer Release:
- Change to the `develop` branch if not already on it.
- Do a `git pull` to make sure you are up to date with all changes.
- Make sure you are logged into `npm`. In your terminal type `npm whoami` and that you have permissions to do npm releases with that account.
- Run `npm run release:<semverType>` where <semverType> could be either `patch`, `minor`, or `major`. Example, for a bug fix that is not a breaking change, you would run `npm run release:patch`.
- This will execute the release script, running the tests first (a release will not happen with failed tests) and also setting the A2J Viewer footer version to the current date.
- Once the npm release is successful, do a pull request from `develop` into `production` to keep it in parity with the npm release.
- Generate the Standalone Viewer zip file from the newly update `production` branch. Execute `npm run build:viewer-zip` and then update the [A2J Viewer Release](https://github.com/CCALI/a2jviewer/releases) with the latest .zip file and release info.
- OPTIONAL -> Update A2J Author to this npm package release as it uses the A2J Viewer for Preview Testing. Ggo to your terminal in the Author repo and execute `npm install @caliorg/a2jviewer@latest` which will update both the package.json file and the package-lock.json in Author to this latest release version in the respective codebase.

## A2J DAT Release:
- A2J DAT has it's own install steps in the Repo's local [README.md](https://github.com/CCALI/a2jdat) file.

## A2J Author Release:
- `ssh` into the production environment and `cd` into the repo root folder on that server.
- Cleanup any old artifacts from a previous install including index.html files and previous `node_modules`
- Change to the `production` branch if not already on it.
- Make sure this branch is up to date with a `git pull` and that the `production` branch has all expected bug and feature fixes, usually via a successful pull request from the fully QA-ed `develop` branch into the `production` branch.
- Execute the `npm run deploy` script. This will build the minified and bundled Author code, as well generate the proper footer version and production `index.html` file.
- When the deploy script completes, you should be able to refresh `www.a2jauthor.org` to see the latest changes, showing the current date in footer.
- OPTIONAL -> restart the A2J DAT instance(s) if it was updated as well.
