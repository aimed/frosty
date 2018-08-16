# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

<a name="2.0.0"></a>
# [2.0.0](https://github.com/aimed/frosty/compare/v1.5.0...v2.0.0) (2018-08-16)


### Bug Fixes

* only generate gql types in src/ ([633b7a0](https://github.com/aimed/frosty/commit/633b7a0))


### Code Refactoring

* units belong to the connection ([a61c4e3](https://github.com/aimed/frosty/commit/a61c4e3))


### Features

* local fridge should add existing items if they match a suggestion ([4376c14](https://github.com/aimed/frosty/commit/4376c14))


### BREAKING CHANGES

* Unit now belongs to the fridge ingredient, not to the ingredient itself.




<a name="1.5.0"></a>
# [1.5.0](https://github.com/aimed/frosty/compare/v1.4.1...v1.5.0) (2018-08-15)


### Bug Fixes

* adds missing type ([4f6aabb](https://github.com/aimed/frosty/commit/4f6aabb))
* handle invalid tokens ([880bdcf](https://github.com/aimed/frosty/commit/880bdcf))
* update emoji search types ([d28a728](https://github.com/aimed/frosty/commit/d28a728))


### Features

* adds AboutPage ([5d313c7](https://github.com/aimed/frosty/commit/5d313c7))
* adds AboutPage ([cdf7954](https://github.com/aimed/frosty/commit/cdf7954))




<a name="1.4.1"></a>
## [1.4.1](https://github.com/aimed/frosty/compare/v1.4.0...v1.4.1) (2018-08-15)




**Note:** Version bump only for package undefined

<a name="1.4.0"></a>
# [1.4.0](https://github.com/aimed/frosty/compare/v1.3.0...v1.4.0) (2018-08-15)


### Features

* minor style fixes ([78b1360](https://github.com/aimed/frosty/commit/78b1360))
* remove docker ([f81804c](https://github.com/aimed/frosty/commit/f81804c))




<a name="1.3.0"></a>
# [1.3.0](https://github.com/aimed/frosty/compare/v1.2.1...v1.3.0) (2018-08-15)


### Features

* adds privacy disclaimer and global layout ([1b263c1](https://github.com/aimed/frosty/commit/1b263c1))




<a name="1.2.1"></a>
## [1.2.1](https://github.com/aimed/frosty/compare/v1.2.0...v1.2.1) (2018-08-14)


### Bug Fixes

* more responsive and improved footer ([d365a2b](https://github.com/aimed/frosty/commit/d365a2b))




<a name="1.2.0"></a>
# [1.2.0](https://github.com/aimed/frosty/compare/v1.1.0...v1.2.0) (2018-08-14)


### Features

* implements all password recovery steps ([d7bd85c](https://github.com/aimed/frosty/commit/d7bd85c))




<a name="1.1.0"></a>
# 1.1.0 (2018-08-14)


### Bug Fixes

* adds missing entities.ts ([98c58f2](https://github.com/aimed/frosty/commit/98c58f2))
* fetch more items by default ([95452ff](https://github.com/aimed/frosty/commit/95452ff))
* improves responsive margins ([d540f87](https://github.com/aimed/frosty/commit/d540f87))
* move icon to the other side ([b343550](https://github.com/aimed/frosty/commit/b343550))
* performance improvements by parallizing queries ([637da5c](https://github.com/aimed/frosty/commit/637da5c))
* removes access and reset tokens when user is deleted ([07f0a27](https://github.com/aimed/frosty/commit/07f0a27))
* still displays removed items until page reload ([126b9d6](https://github.com/aimed/frosty/commit/126b9d6))
* temp set flag: https://github.com/whitecolor/ts-node-dev/issues/25 ([91ef82f](https://github.com/aimed/frosty/commit/91ef82f))
* uses trash icon instead of minus ([519f5e6](https://github.com/aimed/frosty/commit/519f5e6))


### Features

* add ability to remove items form the fridge ([1a83c4e](https://github.com/aimed/frosty/commit/1a83c4e))
* add instance of ingredient ([369ac47](https://github.com/aimed/frosty/commit/369ac47))
* add min length to passwords ([1d2f9db](https://github.com/aimed/frosty/commit/1d2f9db))
* add user fridge if not existing ([8c88f71](https://github.com/aimed/frosty/commit/8c88f71))
* adding ingredients now changes the amount and doesn't add it multiple times ([af1bf30](https://github.com/aimed/frosty/commit/af1bf30))
* adds ability to add ingredients ([cd47671](https://github.com/aimed/frosty/commit/cd47671))
* adds ability to query ingredients in local fridge ([17dc888](https://github.com/aimed/frosty/commit/17dc888))
* adds ablity to delete users ([835cf9b](https://github.com/aimed/frosty/commit/835cf9b))
* adds addIngredient mutation ([947186d](https://github.com/aimed/frosty/commit/947186d))
* adds allIngredients query ([0785c20](https://github.com/aimed/frosty/commit/0785c20))
* adds client with basic auth methods ([e7950ef](https://github.com/aimed/frosty/commit/e7950ef))
* adds errors when applicable ([389d56d](https://github.com/aimed/frosty/commit/389d56d))
* adds errors when applicable ([246cd2b](https://github.com/aimed/frosty/commit/246cd2b))
* adds frdige content placeholder ([2c0ea36](https://github.com/aimed/frosty/commit/2c0ea36))
* adds fridge ingredients connection ([788e31d](https://github.com/aimed/frosty/commit/788e31d))
* adds fridges and ingredients ([bf446d2](https://github.com/aimed/frosty/commit/bf446d2))
* adds icons ([ea02194](https://github.com/aimed/frosty/commit/ea02194))
* adds icons based on twemoji ([0817f24](https://github.com/aimed/frosty/commit/0817f24))
* adds loader ([d44ef36](https://github.com/aimed/frosty/commit/d44ef36))
* adds local fridge ([6fa2151](https://github.com/aimed/frosty/commit/6fa2151))
* adds more units, such as empty and piece ([20eedd8](https://github.com/aimed/frosty/commit/20eedd8))
* adds PageLoader to async load pages ([246e7b6](https://github.com/aimed/frosty/commit/246e7b6))
* adds password reset ability ([48c5a76](https://github.com/aimed/frosty/commit/48c5a76))
* adds popover menu ([de4be85](https://github.com/aimed/frosty/commit/de4be85))
* adds prettier suggestion box ([26eb8f3](https://github.com/aimed/frosty/commit/26eb8f3))
* adds registration/authentication ([cbe96c5](https://github.com/aimed/frosty/commit/cbe96c5))
* adds roles ([c2a8b43](https://github.com/aimed/frosty/commit/c2a8b43))
* adds roles ([8ddb1a3](https://github.com/aimed/frosty/commit/8ddb1a3))
* adds typeorm ([7ad6242](https://github.com/aimed/frosty/commit/7ad6242))
* adds units ([2314b63](https://github.com/aimed/frosty/commit/2314b63))
* complete password reset flow ([6626d85](https://github.com/aimed/frosty/commit/6626d85))
* display client from server ([b0e35d8](https://github.com/aimed/frosty/commit/b0e35d8))
* improves query by joining relation ([a2394d7](https://github.com/aimed/frosty/commit/a2394d7))
* move to sqlite to fix problems with nested entities in mongodb ([528c218](https://github.com/aimed/frosty/commit/528c218))
