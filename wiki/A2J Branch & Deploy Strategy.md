## Current Strategy
* the `production` branch is used for deploy to production only
* the `develop` branch is the working/staging branch used for code being tested pre-production
* issue branches are created off the `develop` branch, then reviewed and QA'ed prior to being merged back into the `develop` branch
* branches are named with issue number + short description, ex: `1980-variable-creation`
* commits generally follow this recommendation https://robots.thoughtbot.com/5-useful-tips-for-a-better-commit-message

## Current PR review and QA
* PRs are peer reviewed by any CALI teammates and/or Bitovi OS members for sanity checking
* the `develop` branch is deployed to `dev.a2jauthor.org` or similar dev server
* any standalone viewer related testing is done on `viewerdev.a2jauthor.org` and `viewerdevazure.a2jauthor.org`
* Pre merge to `production`, the `develop` branch is deployed to `staging.a2jauthor.org` for a final round of testing (ideally this would eventually involve A2J authors from the community as well)
* once approved in the staging environment, the `develop` branch is merged to `production` which is deployed to `www.a2jauthor.org`
* deploy steps using the deploy script outlined in the [wiki](./A2J%20Production%20Release%20and%20Deploy%20Flow.mdA2J Production)

## Future branch/deploy strategy
_CALI has been prepped with a dev/staging/production server setup to allow for Continuous Integration/Deployment_
* new branches would be created off the current `develop` branch
* `dev.a2jauthor.org`, `viewerdevazure.a2jauthor.org` and `viewerdev.a2jauthor.org` would still be used for any dev testing requiring deployment
* branches ready for Jessica and/or community testing would be merged into the `develop` branch and deployed to `staging.a2jauthor.org`
* code that passes testing in the `staging` environment would be merged to `production` which would auto-test and deploy using CI tools (currently no auto deployment)
