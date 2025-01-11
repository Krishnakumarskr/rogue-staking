<!-- PROJECT SHIELDS -->

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <h3 align="center">Rogue Staking</h3>

  <p align="center">
    Staking platform on Solana
    <br />
    <a href="https://github.com/Krishnakumarskr/rogue-staking/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    ·
    <a href="https://github.com/Krishnakumarskr/rogue-staking/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

Rogue staking is a simple staking implementation on the Solana chain.

### Built With

-   Rust
-   Anchor
-   Solana

<!-- GETTING STARTED -->

## Getting Started

### Prerequisites

Make sure you have yarn, git, rust, solana-cli, and anchor installed and configured on your system.

### Installation

Clone the repo,

```shell
git clone https://github.com/Krishnakumarskr/rogue-staking.git
```

cd into the repo, and install the necessary dependencies,

```shell
cd rogue-staking
yarn install
anchor build
```

Run tests by executing,

```shell
anchor localnet
anchor run <test-name>
```

That's it, you are good to go now!

<!-- ROADMAP -->

## Roadmap

-   [x] Solana program development
-   [x] Unit tests
-   [x] Write a good README.md

See the [open issues](https://github.com/Krishnakumarskr/rogue-staking/issues) for a full list of proposed features (and known issues).

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/Krishnakumarskr/rogue-staking.svg?style=for-the-badge
[contributors-url]: https://github.com/Krishnakumarskr/rogue-staking/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/Krishnakumarskr/rogue-staking.svg?style=for-the-badge
[forks-url]: https://github.com/Krishnakumarskr/rogue-staking/network/members
[stars-shield]: https://img.shields.io/github/stars/Krishnakumarskr/rogue-staking.svg?style=for-the-badge
[stars-url]: https://github.com/Krishnakumarskr/rogue-staking/stargazers
[issues-shield]: https://img.shields.io/github/issues/Krishnakumarskr/rogue-staking.svg?style=for-the-badge
[issues-url]: https://github.com/Krishnakumarskr/rogue-staking/issues
[license-shield]: https://img.shields.io/github/license/Krishnakumarskr/rogue-staking.svg?style=for-the-badge
[license-url]: https://github.com/Krishnakumarskr/rogue-staking/blob/master/LICENSE.txt
