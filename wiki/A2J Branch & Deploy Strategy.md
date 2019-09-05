## Current Strategy
* the `master` branch is used for deploy to production only
* the `develop` branch is the working/staging branch used to for code being tested pre-production
* issue branches are created off the `develop` branch, then reviewed and QA'ed prior to being merged back into the `develop` branch
* branches are named with issue number + short description, ex: `1980-variable-creation`
* commits generally follow this recommendation https://robots.thoughtbot.com/5-useful-tips-for-a-better-commit-message

## Current PR review and QA
* PRs are peer reviewed by any CALI teammates and/or Bitovi OS members for sanity checking
* for user QA, a local branch is used or created with the code to be tested
* that local branch is deployed to the `dev.a2jauthor.org` dev server
* any standalone viewer related testing is done on `viewerdev.a2jauthor.org` and `viewerdevazure.a2jauthor.org`
* Jessica from CALI does QA testing on any fixes/new features and approves them or gives notes back on issues
* after QA has passed, the tested PR is merged into the `develop` branch
* Pre merge to `master`, the `develop` branch is deployed to `staging.a2jauthor.org` for a final round of testing (ideally this would eventually involve A2J authors from the community as well)
* once approved in the staging environment, the `develop` branch is merged to `master` which is deployed to `www.a2jauthor.org`
* deploy steps using the deploy script, or manual deployment can be found in other wikis
   https://github.com/CCALI/CAJA/wiki/Deploying-A2J-6-manually-(no-deploy-script)
   (deprecated) https://github.com/CCALI/CAJA/wiki/Deploying-A2J-6-using-deploy-script

## Future branch/deploy strategy
_CALI has been prepped with a dev/staging/production server setup to allow for Continuous Integration/Deployment_
* new branches would be created off the current `develop` branch
* `dev.a2jauthor.org`, `viewerdevazure.a2jauthor.org` and `viewerdev.a2jauthor.org` would still be used for any dev testing requiring deployment
* branches ready for Jessica and/or community testing would be merged into the `develop` branch and deployed to `staging.a2jauthor.org`
* code that passes testing in the `staging` environment would be merged to `master` which would auto-test and deploy using CI tools (currently no auto deployment)
