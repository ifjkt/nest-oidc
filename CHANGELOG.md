# [10.2.0](https://github.com/ifjkt/nest-oidc/compare/v10.1.0...v10.2.0) (2024-01-27)


### Features

* **authority:** allow multiple JWK urls ([7598996](https://github.com/ifjkt/nest-oidc/commit/7598996b1109a546d6586bfbd1b9bc1c2d48ede9))
* **jwk:** enable caching ([199559b](https://github.com/ifjkt/nest-oidc/commit/199559be1e311d746b5855cae92925bdad2dd32f))



# [10.1.0](https://github.com/ifjkt/nest-oidc/compare/v10.0.3...v10.1.0) (2024-01-17)


### Bug Fixes

* **auth-guard:** role and permission evaluation ([943ea16](https://github.com/ifjkt/nest-oidc/commit/943ea16f14fe9c990f7cb894c2b2f8fed2ccd8e4))
* **auth-guard:** throw exception on invalid user body from JWT ([9db6cff](https://github.com/ifjkt/nest-oidc/commit/9db6cff5481b14b86a3d3d6a4f37818eb7857056))


### Features

* change role evaluators to roles ([ab4a2d2](https://github.com/ifjkt/nest-oidc/commit/ab4a2d24f4574cb9fec1ecd6b0a0a792340b66f9))
* remove jexl ([ddbfaef](https://github.com/ifjkt/nest-oidc/commit/ddbfaef8eaf5a4cf6bce1905071f9ecd31268f8f))



## [10.0.3](https://github.com/ifjkt/nest-oidc/compare/v10.0.2...v10.0.3) (2024-01-16)


### Features

* forRootAsync ([46d1ae9](https://github.com/ifjkt/nest-oidc/commit/46d1ae9cf4339a251f56a3aeddba89f2ddb0bdc8))



## [10.0.2](https://github.com/ifjkt/nest-oidc/compare/10.0.1...v10.0.2) (2024-01-16)


### Features

* permissions feature ([2e1b395](https://github.com/ifjkt/nest-oidc/commit/2e1b395751ebf1320cb3a3a209694edae6e2be8a))



## [10.0.1](https://github.com/ifjkt/nest-oidc/compare/10.0.0...10.0.1) (2024-01-16)


### Bug Fixes

* axios dependencies ([d1a98c1](https://github.com/ifjkt/nest-oidc/commit/d1a98c10f0b4c045885fa103809c9998d5f1507d))



# [10.0.0](https://github.com/ifjkt/nest-oidc/compare/2.0.0...10.0.0) (2024-01-16)


### Features

* bump nest version to 10.x ([500c14c](https://github.com/ifjkt/nest-oidc/commit/500c14c819ef7448766abd28f31ad5b0e9db0a63))



# [2.0.0](https://github.com/ifjkt/nest-oidc/compare/b749f68d48291c236961be5ff0eb36d61b5a081e...2.0.0) (2023-01-11)


### Bug Fixes

* **package.json:** update peer dependencies ([cffae2d](https://github.com/ifjkt/nest-oidc/commit/cffae2d9eb202b8e5598de487c62fdaa1f5dee6c))
* **roles:** fix roles disabling logic ([55e7605](https://github.com/ifjkt/nest-oidc/commit/55e76054cc3e11c8a8d14e82cfd6f442d655ac3f))


### Features

* ***/*:** add basic OIDC JWT validation and utilities ([b749f68](https://github.com/ifjkt/nest-oidc/commit/b749f68d48291c236961be5ff0eb36d61b5a081e))
* ***/*:** added JWT mapper and abstracted role functionality ([2b015d5](https://github.com/ifjkt/nest-oidc/commit/2b015d5ccb5b64367d6c5e0c8f23496f56dc7a2c))
* **access-levels:** abstract access level evaluation for greater flexibility ([9b28811](https://github.com/ifjkt/nest-oidc/commit/9b28811120a4bfa5fb2b952baf2ebdee4b1de299))
* **guards, decorators:** add the ability to specify an optional authentication guard ([4e4dcc5](https://github.com/ifjkt/nest-oidc/commit/4e4dcc586c4209570596e67506351c0fdc07ccc5))
* **nestjs:** upgrade library for compatibility with nestjs 9 ([31936d0](https://github.com/ifjkt/nest-oidc/commit/31936d0a5cef3054b0f996116213490bf9d16879))
* **roles:** allow for the disabling of role validation by passing no roles ([37d9ac5](https://github.com/ifjkt/nest-oidc/commit/37d9ac5265a1e5eb2c6a9fecc5c0658d1a21a6db))
* support rest decorators; make graphql optional ([ae1479b](https://github.com/ifjkt/nest-oidc/commit/ae1479b643f14a1f115e56d21aa9c8fa40656d02))



