const Discord = require('discord.io');
const logger = require('winston');
const auth = require('./auth.json');
const mysql = require('mysql');

//Global Variables
var channels = ["553229545080094738", "553298486746152980", "553297571976708110", "570196858442481665", "570254511701229608", "557881392449454090", "570255487556386816", "541946644644757515"]; // 0 = GENERAL-CHANNEL, 1 = SUPPORT-CHANNEL, 2 = DONERA-CHANNEL, 3 = SUPPORT-CHANNEL, 4 = TIPS-CHANNEL, 5 = HEX-CHANNEL, 6 = BUG-CHANNEL, 7 = TEST-CHANNEL
var roles = ["553297831113392148", "553225674941530122"]; // 0 = Staff, 1 = Developer
var users = ["540520975599403011"]; // 0 = BOT
var command;
var tot_money;
var a_identifier;
var sql;

var date = new Date(); //Date (YEAR/MONTH/DAY)
var final_date = date.getFullYear() + "/" + date.getMonth() + "/" + date.getDate();
var final_date_w_time = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

//MySQL Connection
const conn = mysql.createConnection({
	host: '68.183.71.241',
	user: 'jb-rp',
	password: 'sNDL5rAHuxXgHAdNWXh8tTTggGF5',
	database: 'junibacken'
});

/*
const conn = mysql.createConnection({
	host: '68.183.71.241',
	user: 'junibacken',
	password: 'g00nshr3d!_',
	database: 'junibacken'
});
*/


//Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

// Initialize Discord Bot
const bot = new Discord.Client({
   token: auth.token,
   autorun: true
});

bot.on('ready', function (evt,) {
    logger.info('Connection Succeded, bot ready to use');
    logger.info('Junibacken RP Bot');
    logger.info("(" + final_date_w_time + ") - " + bot.username + " - ID (" + bot.id + ")");
});

//Checks if the connection was a succes.
conn.connect((err) => {
	if (err){
		throw err;
	}
	console.log('Connection with database succeded.');
});

//Testing
/*conn.connect(function(err) {
  if (err) throw err;
  conn.query("SELECT * FROM user_whitelist", function (err, result, fields) {
    if (err) throw err;
    console.log(result);
  });
});
*/


//Functions
function quit_connection_spq(){
	conn.end((err) => {
		if (err) {
			console.log('Error disconnecting.');
		}
		console.log('Disconnection complete.');
	});
}

bot.on('message', function (user, userID, channelID, message, evt, error, events) {

    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cont = message;
        var cmd = args[0].toLowerCase();
       
        args = args.splice(1);
        let hexid;

        switch(cmd) {

            case 'help':
            case 'hjälp':
            	command =  "hjälp";
	            if (channelID == channels[0] || channelID == channels[7]) {
	            	const commands = ['**hjälp** - Visar vilka kommandon som är tillgängliga för dig.', '**ansök** - Ansök om en plats hos Junibacken RP.', '**donera** - Känner du dig generös? Donera till Junibacken!', /*'**support** - Behöver du hjälp? Skriv ett meddelande till alla staffs !support [meddelande].',*/'**tips** - Har du några tips till servern? !tips [meddelande] .', '**bugg** - Har du upplevt en bugg? Meddela staff! !bug [meddelande]', '**ekonomi** - Utforska stadens ekonomi!', '**invånare** - Se hur många invånare som finns i Junibacken!'];
	            	const x = commands.toString();
	            	const y = x.split(",");
	            	const final = [];

	            	final.push("\n" + y[0]);

	            	for (var i = 0; i < (y.length - 1); i++) {
	            		final.push("\n" + y[i + 1]);
	            	}

					bot.sendMessage({ 
						to: channelID, 
						message: "***Lista av alla kommandon:*** **" + final.join("") + "**"
					});
				} else {
					console.log("\x1b[31m", "Command (!" + command + ") used outside requested channelID.");
            		console.log("\x1b[37m", "Use this command inside requested channelID/s");
				}
            break;

            case 'rwhitelist':
	            	hexid = 'steam:' + message.substring(11).trim();
	            	console.log(hexid);

					  conn.query("UPDATE user_whitelist SET whitelisted=0 WHERE identifier=?", hexid, function (err, result, fields) {
					  	console.log(err);
					    console.log(result);
					    console.log(fields);

							let ret = 'Invånaren med hexid **' + hexid.substring(6) + '** är nu mer INTE whitelistad.';

						    if (!(err === null)) {
						    	ret = 'Hoppsan <@' + userID + '>! Något gick fel, försök igen och om felet återuppstår kontakta ansvarig utgivare. **(' + message + ')**';
						    	bot.deleteMessage({
	            					channelID: channelID,
	            					messageID: evt.d.id
	            				});
						    }

						    bot.sendMessage({
						   		to: channelID,
						   		message: ret,
						   	});
					  });
            break;            

            case 'whitelist':
	            if (channelID == channels[5]) {
	            	hexid = 'steam:' + message.substring(11).trim();
	            	hexid = hexid.toLowerCase();
	            	const whitelisted = '1';
		            	const sql = "INSERT INTO user_whitelist (identifier, whitelisted) VALUES ? ON DUPLICATE KEY UPDATE whitelisted=1";
		            	const values = [
		            		[hexid, whitelisted]
		            	];

						  conn.query(sql, [values], function (err, result, fields) {
						  	console.log(err);
						    console.log(result);
						    console.log(fields);

						    let ret = 'Invånaren med hexid **' + hexid.substring(6) + '** är nu whitelistad!';

						    if (!(err === null)) {
						    	ret = 'Hoppsan <@' + userID + '>! Något gick fel, försök igen och om felet återuppstår kontakta ansvarig utgivare. **(' + message + ')**';
						    	bot.deleteMessage({
	            					channelID: channelID,
	            					messageID: evt.d.id
	            				});
						    }

						    bot.sendMessage({
						   		to: channelID,
						   		message: ret,
						   	});
						  });

						 conn.query("SELECT * FROM user_whitelist", function (err, result, fields) {
	   					 console.log(result);
	 					 });
	 			}
            break;

            /*case 'support':
            	command = "support";

	            if (channelID == channels[0] || channelID == channels[7]) {
	            	const target_channel_staff = channels[7];
	            	const target_role_staff = roles[0];

	            	var staff_message = message.substring(9);

	            	bot.sendMessage({
	            		to: target_channel_staff,
	            		message: "**SUPPORT:** <@&" + target_role_staff + "> *(" + final_date_w_time + ")*, **<@" + userID + ">** har skickat detta meddelande:\n\n" + staff_message
	            	});

	            	bot.deleteMessage({
	            		channelID: channelID,
	            		messageID: evt.d.id
	            	});

	            	bot.sendMessage({
	            		to: channelID,
	            		message: "<@" + userID + ">, ett meddelande har skickats till staff! Hjälp kommer snart, sätt dig i support kanalen!"
	            	});
	            } else {
					console.log("\x1b[31m", "Command (!" + command + ") used outside bot-channel/support_channel");
            		console.log("\x1b[37m", "Use this command inside requested channelID/s");
				}
	            break;*/

            case 'ansök':
            	command = "ansök";
	            	bot.sendMessage({
	            		to: channelID,
	            		message: "**Ansök om whitelist här:** https://www.ciinary.se/"
	            	});
            break;

            case 'donera':
            	command = "donera";

            	if (channelID == channels[0] || channelID == channels[2]) {
            		bot.sendMessage({
            			to: channelID,
            			message: "**Känner dig generös och vill stödja Junibacken RP? Gör det här:** https://goo.gl/C6BFhE"
            		});
            	} else {
            		console.log("\x1b[31m", "Command (!" + command + ") used outside requested channelID.");
            		console.log("\x1b[37m", "Use this command inside requested channelID/s");
            	}
            break;

            case 'tips':
            	command = "tips";

            	if (channelID == channels[0] || channelID == channels[7]) {
	            	const target_channel_tips = channels[4];
	            	const target_role_staff = roles[0];

	            	var user_message = message.substring(6);

	            	bot.sendMessage({
	            		to: target_channel_tips,
	            		message: "**TIPS:** " + /*<@&" + target_role_staff +*/"*(" + final_date_w_time + ")*, **<@" + userID + ">** har skickat in detta tips:\n\n" + user_message
	            	});

	            	bot.deleteMessage({
	            		channelID: channelID,
	            		messageID: evt.d.id
	            	});

	            	bot.sendMessage({
	            		to: channelID,
	            		message: "<@" + userID + ">, tack för ditt tips! Vi kommer att se över detta!"
	            	});
	            } else {
					console.log("\x1b[31m", "Command (!" + command + ") used outside bot-channel/support_channel");
            		console.log("\x1b[37m", "Use this command inside requested channelID/s");
				}
	            break;
            break;

            case 'bugg':
            	command = "bugg";

            	if (channelID == channels[0] || channelID == channels[7]) {
	            	const target_channel_tips = channels[6];
	            	const target_role_staff = roles[0];

	            	var user_message = message.substring(5);

	            	bot.sendMessage({
	            		to: target_channel_tips,
	            		message: "**BUGG:** " + /*<@&" + target_role_staff + ">*/"*(" + final_date_w_time + ")*, **<@" + userID + ">** har skickat in en bug:\n\n" + user_message
	            	});

	            	bot.deleteMessage({
	            		channelID: channelID,
	            		messageID: evt.d.id
	            	});

	            	bot.sendMessage({
	            		to: channelID,
	            		message: "<@" + userID + ">, tack för din bug-report! Vi kommer att se över detta!"
	            	});
	            } else {
					console.log("\x1b[31m", "Command (!" + command + ") used outside bot-channel/support_channel");
            		console.log("\x1b[37m", "Use this command inside requested channelID/s");
				}
	            break;
            break;

            case 'ekonomi':
				conn.query("SELECT money FROM users", function (err, result, fields) {

				    if (!(err === null)) {
				    		bot.sendMessage({
				    			to: channelID,
				    			message: "Hoppsan <@" + userID + ">! Något gick fel, det gick inte att få fram stadens ekonomi. Försök igen och om felet återuppstår kontakta ansvarig utgivare."
				    		});
						    bot.deleteMessage({
	            				channelID: channelID,
	            				messageID: evt.d.id
	            			});
					} else {

				    var tot_money = 0;

				    Object.keys(result).forEach(function(key) {
				      var row = result[key];
				      tot_money += row.money;
				    });
				    console.log(tot_money);
				    bank(tot_money);
				  }
				});

					function bank (total_money) {
					  conn.query("SELECT bank FROM users", function(err, result, fields) {		  	

					var tot_bank = 0;

					    Object.keys(result).forEach(function(key) {
					      var row = result[key];
					      tot_bank += row.bank;
					    });
					    console.log(tot_bank);
					    money(total_money, tot_bank);
				});
			}

				  function money (total_money, total_bank) {
					  conn.query("SELECT * FROM users", function (err, result, fields) {
					    let tot_players = 0;

					   	Object.keys(result).forEach(function(key) {
					      let row = result[key];
					      tot_players++;
					    });

					    var tot_money = total_money + total_bank;

					    var avg_money = Math.round(tot_money / tot_players);

					    console.log(tot_players + " PLAYERS WHITELISTED");
					    console.log(avg_money + " AVG. MONEY");

					    bot.sendMessage({
					    	to: channelID,
					    	message: 'Den totala summan av pengar som finns i Junibacken: **' + Math.round(tot_money) + " kr.** \nBNP per invånare: **" + avg_money + " kr**."
					    });
					  });
				   }
            break;

            case 'invånare':
            	conn.query("SELECT * FROM users", function (err, result, fields) {

				    if (!(err === null)) {
				    		bot.sendMessage({
				    			to: channelID,
				    			message: "Hoppsan <@" + userID + ">! Något gick fel, det gick inte att få fram stadens invånare. Försök igen och om felet återuppstår kontakta ansvarig utgivare."
				    		});
						    bot.deleteMessage({
	            				channelID: channelID,
	            				messageID: evt.d.id
	            			});
					} else {

				    var tot_inv = 0;

				    Object.keys(result).forEach(function(key) {
				      var row = result[key];
				      tot_inv++;
				    });
				    console.log(tot_inv);
				    bot.sendMessage({
				    	to: channelID,
				    	message: "Totalt antal invånare i Junibacken: **" + tot_inv + " st**."
				    });
				  }
				});
            break;

            case 'me':
            	conn.query('SELECT * FROM user_discord WHERE discord_id = ' + userID +';', function(err, result, fields) {
            		if (result.length <= 0) {
            			bot.sendMessage({
				   			to: channelID,
				    		message: "Hoppsan <@" + userID + ">! Det verkar som att du inte har registrerat dig för **!me** kommandot. Skriv **!register [STEAM HEXID]** för att regitrera dig."
					    });
            		}

            		a_identifier = result[0].identifier;
            		sql = 'SELECT * FROM users WHERE identifier = "'+a_identifier+'";';

            		conn.query(sql, function (err, result, fields) {
	            		if (err === null) {
	            			if (result.length <= 0) {
		            			bot.sendMessage({
						   			to: channelID,
						    		message: "Hoppsan <@" + userID + ">! Det verkar som att du inte har registrerat dig för **!me** kommandot. Skriv **!register [STEAM HEXID]** för att regitrera dig."
							    });	            				
	            			} else {
	            				var ch = result[0];

	            				// Date of birth i databasen = '1990-03-05'
								var dateofbirth_r = ch.dateofbirth.replace('-', '');
								// Ändrar date of birth till = '19900305'
								var dob = dateofbirth_r.replace('-', '');

	            				var messageComplete = '```' + ch.firstname + ' ' + ch.lastname + '\n' + dob + '-' + ch.lastdigits + '\n' + 'Tel: ' + ch.phone_number;
			            		bot.sendMessage({
						   			to: userID,
						    		message: messageComplete
							    });
	            			}
	            		} else {
	            			throw err;
	            		}
            		});
            	});

            break;

            case 'register':
            	var user_message = message.substring(10);
 				var identifier = 'steam:' + user_message;

 				conn.query('INSERT INTO user_discord (identifier, discord_id) VALUES ("' + identifier + '", "' + userID + '");', function (err, result, fields) {
	 				if (err === null) {
	 					bot.sendMessage({
					   		to: channelID,
					   		message: "JADDÅ <@" + userID + ">!"
					    });
					} else {
						console.log(err);
					}
 				});
            break;

            /*
                        case 'ekonomi':
				conn.query("SELECT money FROM users", function (err, result, fields) {

				    if (!(err === null)) {
				    		bot.sendMessage({
				    			to: channelID,
				    			message: "Hoppsan <@" + userID + ">! Något gick fel, det gick inte att få fram stadens ekonomi. Försök igen och om felet återuppstår kontakta ansvarig utgivare."
				    		});
						    bot.deleteMessage({
	            				channelID: channelID,
	            				messageID: evt.d.id
	            			});
					} else {

				    var tot_money = 0;

				    Object.keys(result).forEach(function(key) {
				      var row = result[key];
				      tot_money += row.money;
				    });
				    console.log(tot_money);
				    bank(tot_money);
				  }
				});

					function bank (total_money) {
					  conn.query("SELECT bank FROM users", function(err, result, fields) {		  	

					var tot_bank = 0;

					    Object.keys(result).forEach(function(key) {
					      var row = result[key];
					      tot_bank += row.bank;
					    });
					    console.log(tot_bank);
					    money(total_money, tot_bank);
				});
			}

				  function money (total_money, total_bank) {
					  conn.query("SELECT * FROM user_whitelist WHERE whitelisted = 1", function (err, result, fields) {
					    let tot_players = 0;

					   	Object.keys(result).forEach(function(key) {
					      let row = result[key];
					      tot_players++;
					    });

					    var tot_money = total_money + total_bank;

					    var avg_money = Math.round(tot_money / tot_players);

					    console.log(tot_players + " PLAYERS WHITELISTED");
					    console.log(avg_money + " AVG. MONEY");

					    bot.sendMessage({
					    	to: channelID,
					    	message: 'Den totala summan av pengar som finns i Junibacken: **' + Math.round(tot_money) + " kr**.\nAv totalt **" + tot_players + "** invånare i staden så är BNP per invånare: **" + avg_money + " kr**."
					    });
					  });
				   }
            break;
            */


            //Other commands, not to be used by others than the bot.
            case '--':
            	command = "--";

            	if (userID == users[0]) {
			        bot.addReaction({
				        channelID: channelID,
				        messageID: evt.d.id,
				        reaction: "✅"
			        },);
		    	} else {
		    		console.log("\x1b[31m", "someone tried using the command (!" + command + ").");
		    		console.log("\x1b[37m", "reset.");
		    	}
            break;
         }
     }
});