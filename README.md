# Dotmeet
Telegram based event management app for web3 communities. 


## Introduction
Dotmeet aims to assist web3 communities and companies in effectively reaching their target audience within cities by offering a city-based events calendar app.

Features:
- Anyone can contribute an event
- Event is published on the event channel
- Get reminder for upcoming events
- Get upcoming events using bot


## How to run locally?
Step-by-step guide to get a copy of the project up and running locally for development and testing.

1. Deploying canisters
   
```bash
$ git clone https://github.com/dotmeet/dotmeet-icp
$ cd dotmeet-icp/canisters/dotmeet/
$ npm install
$ dfx start --background
$ dfx deploy
```
2. Copy the Telegram canister ID from the terminal
3. Create a Telegram Bot using BotFather and obtain the token
4. Go the src folder in the root
```bash
$ cd ../../src
```
5. Create a `.env.local` file with the following content
```
DOTMEET_BOT_TOKEN= 
TELEGRAM_CANISTER_ID=
```
6. Running the server
```bash
$ npm install
$ npm run dev
```
7. Open your Telegram Bot and test Dotmeet.


## Canisters

There are two canisters:
1. Event Canister: This canister will be responsible for storing and managing event data. this canister will contain functions, which will be implemented as committing update calls since they involve state changes
2. Telegram Canister: This canister will handle Telegram bot interactions and interact with the Event Canister.
## Roadmap

- [x] Migrate the working of bot to ICP using canisters
- [x] Anyone can contribute an event 
- [x] Get upcoming events 
- [ ] Connecting the bot to the channel
- [ ] Connecting the bot to the mobile app

## Technologies Used

- NodeJs
- Canisters


## License
This project is licensed under the MIT license, see LICENSE.md for details. 


## References
- [Internet Computer](https://internetcomputer.org)

