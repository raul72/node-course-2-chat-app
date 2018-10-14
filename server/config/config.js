const config = {
  port: process.env.PORT || 4000
};

// show last n messages when joinig the serer
config.messageHistory = {
  enabled: true,
  limit: 20,
  maxAge: 30*60, // seconds
};

module.exports = config;
