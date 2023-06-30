# Discord Availability Bot

This Discord bot allows users to set their availability time and check the availability of other users or see who is currently available. It is built using the `discord.js` library and `quick.db` for storing availability data.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Commands](#commands)

## Prerequisites

- Node.js (version 16.6.0 or newer)
- npm (comes with Node.js)

## Installation

1. Clone this repository or download the source code.
2. Open a terminal/command prompt in the bot's directory.
3. Run `npm install` to install the required dependencies.

## Configuration

1. Create a `config.json` file in the bot's directory, if it doesn't exist.
2. Add the following contents to the `config.json` file, replacing `YOUR_BOT_TOKEN` with your bot's token:

```json
{
  "botToken": "YOUR_BOT_TOKEN"
}
```

## Usage

Start the bot by running `node index.js` in the terminal/command prompt.
Invite the bot to your Discord server.
Use the available commands to set and check user availability.

## Commands

### `/setavailable`

Set your availability time.

- `start_time`: Your availability start time in 24-hour format (00:00 - 23:59).
- `end_time`: Your availability end time in 24-hour format (00:00 - 23:59).
- `gmt`: Your time zone in the format +HH:MM or -HH:MM.
- `days`: Days of the week you are available (e.g., Mon,Tue,Wed).

Example: `/setavailable start_time:10:30 end_time:18:00 gmt:+02:00 days:Mon,Tue,Wed`

### `/available`

Get the availability time of a specified user.

- `target`: Mention the user whose availability you want to check.

Example: `/available @username`

### `/availablenow`

Get a list of users who are currently available based on their set time range and days of the week.

Example: `/availablenow`
