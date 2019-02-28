<img src="./packages/web/public/logos/logo_transparent.png" alt="GitViz" width="300"/>

## Visualise change in a Git repository

Disclaimer: This is very much an early effort, work in progress, at the moment!

### If you really want to try it out

Notes:

1. There is currently a dependency on Yarn
1. There is no out of the box Windows support currently, if you want to try and make it work, please create a PR!

        git clone https://github.com/supasympa/gitviz.git
        cd gitviz
        yarn
        packages/cli/src/cli.js  -p ./packages/web/public/git-changes.json -t 999999 -r <LOCATION_OF_THE_REPO>
        yarn start

`<LOCATION_OF_THE_REPO>` should be the relative filepath of the git repository you want to analyse.

### Motivation

A lot of change can happen across large repositories over time and it's useful to be able to drill into where and when change happens.
This utility contains tools to create interactive visualisations that help interrogate a Git repository. Specifically it offers tools that may help a user find out the following:

1. Most committed files.
1. Least committed files.
1. The most stable files. (Currently not implemented)
1. The most stable directories. (Currently not implemented)
1. Frequency of change (Currently not implemented)

### An example visualisation

![An example visualisation](GitViz.png)

## References

-   https://stackoverflow.com/questions/1828874/generating-statistics-from-git-repository
-   https://blog.riff.org/2015_10_30_git_tip_of_the_day_show_the_hottest_files_in_a_repo
