SABRUS
======

Project of the Sabrus website

Installation
------------

1. First clone this repository using the git clone command (git clone https://bitbucket.org/abucmn/sabrus-website.git)
2. Change to project root directory and checkout the develop branch with "git checkout develop"
3. Copy app/config/parameters.yml.template to app/config/parameters.yml
4. Edit app/config/parameters.yml according to your local settings
5. Run "composer install" in the project's root directory
6. Wait some minutes until composer downloaded and installed all libraries/packages/bundles needed
7. Install VirtualBox (https://www.virtualbox.org/)
8. Install Vagrant (http://www.vagrantup.com/)
9. Edit your local DNS hosts file (/etc/hosts on *nix/MacOSX and %Windir%\System32\drivers\etc\hosts on Windows Vista or greater) with the entries given in the next section
10. Open a browser and open http://www.sabrus.dev/app_dev.php
11. Enjoy!

hosts file entries
------------------

~~~~
10.0.0.100 sabrus.dev
10.0.0.100 www.sabrus.dev
~~~~

General Information
-------------------

I would strongly recommend to follow these global git ignore infos by GitHub to avoid trash or temporary data to be included into the repository:

https://help.github.com/articles/ignoring-files


Working with this repository
----------------------------

We would like all developers to commit code to the develop branch. The develop branch will be merged into the master branch when the current state of the develop branch has been verified and a new project version shall be pushed to the web server.

For new features that take more time and commits than changing some lines of code we would like all developers to create feature branches from develop and merge them back to develop when you are finished with the feature. Then the feature branch can be deleted.

