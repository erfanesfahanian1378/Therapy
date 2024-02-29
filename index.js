const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const token = '7006964370:AAFGAMqGWikYxNc8-BbX34tp5SL5iyxcKqM';
const bot = new TelegramBot(token, {polling: true});
let ifItsJoined = false;
const userStates = new Map();
const channelUsername = '@ThrapyEn';
const channelUsername2 = '@ProteinTeam';
const joined = ['عضو شدم', 'i joined', 'عضو شدم | i joined'];
let mainMenu = ['منو اصلی', 'main menu', 'منو اصلی | main menu'];
let userProfile = ['حساب کاربری شما📖✏️', 'your profile 📖✏️', 'حساب کاربری شما📖✏️ | your profile 📖✏'];
let aboutUs = ['درباره ما', 'about us', 'درباره ما | about us'];
let createTherapy = ["بیا یک جلسه تراپی متنی را شروع کنیم🧠|🧠start a text to text therapy", "تراپی صوتی🧠|🧠voice to voice therapy", "تراپی های قبلی من🧠|🧠my last therapies"];
let aboutUsText = `
ما در پروتئین، یک تیم پویا و نوآور در عرصه هوش مصنوعی هستیم. 🚀👨‍💻👩‍💻 با ارائه خدمات و سرویس‌های متنوع و خلاقانه، 🌟🛠️ می‌کوشیم تا دسترسی عموم جامعه به ابزارهای پیشرفته هوش مصنوعی را فراهم آوریم. هدف ما، تسهیل فعالیت‌های حرفه‌ای افراد شاغل از طریق به کارگیری قدرت هوش مصنوعی است. 💡🤖💼 ما بر این باوریم که هر فردی باید بتواند از مزایای این فناوری شگفت‌انگیز به نفع خود و جامعه‌اش بهره ببرد. 🌍❤️ با ما همراه باشید تا با هم آینده‌ای روشن‌تر و هوشمندتر بسازیم. 🌈🛠️🔮

At Protein, we are a dynamic and innovative team in the field of AI. 🚀👨‍💻👩‍💻 Offering a variety of creative services and solutions, 🌟🛠️ we strive to provide the public access to advanced AI tools. Our goal is to facilitate professional activities for working individuals by leveraging the power of AI. 💡🤖💼 We believe that everyone should have the opportunity to benefit from the wonders of this incredible technology for their own and societal good. 🌍❤️ Join us in building a brighter and smarter future together. 🌈🛠️🔮
`;
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
let promoteUs = ["با معرفی ما به دوستان خود از ما حمایت کنید .", 'share our robot with your friend', 'با معرفی ما به دوستان خود از ما حمایت کنید | share us with your friend'];
let channelJoin = `لطفا ابتدا عضو کانال‌های ${channelUsername} و ${channelUsername2} شوید.` + '\n' + 'please first join our channels ' + channelUsername + " , " + channelUsername2;
bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    let name = msg.from.first_name + "";
    let surName = msg.from.last_name + "";
    let username = msg.from.username;
    let persian = "درود بر " + name;
    let english = "welcome " + name;
    let welcomeMessage = [persian, english];
    let userState = userStates.get(chatId);
    if (!userState) {
        userState = {
            isCreatingTherapySession: false,
            isRequestingEndingTherapy: false,
            findingLastTherapySession: false,
            isCompletingProfile: false,
            isInvitingFriend: false,
            threadId: "",
            lastText: "",
            preferLanguage: "",
            tone: "",
            textTone: ""
        };
        userStates.set(chatId, userState);
    }
    if (text.startsWith('/start')) {
        console.log("this is id " + msg.from.id);
        console.log(msg.text);

        const args = msg.text.split(' '); // Splits the message into parts
        if (args.length > 1) {
            const referralId = args[1]; // The second part is the referral ID
            // Handle the referral logic here
            console.log(`User ${username || name} was referred by ${referralId}`);
            try {
                await axios.post('http://localhost:3001/invite', {
                    idChatInvitePerson: referralId,
                    idChatGuest: msg.from.id
                });
                console.log("its in the try");
            } catch (error) {
                console.log("its in the error");
                console.error('Error sending data to server:', error);
            }
        }
        console.log("its before is member");
        let isMember = await checkChannelMembership(chatId, msg.from.id);
        let isMember2 = await checkChannelMembership2(chatId, msg.from.id);
        if (!(isMember && isMember2)) {
            console.log("should be here");
            try {
                await axios.post('http://localhost:3001/start', {
                    username: username,
                    name: name,
                    surName: surName,
                    sexuality: "",
                    age: "",
                    idChat: msg.from.id
                });
            } catch (error) {
                console.error('Error sending data to server:', error);
            }
            bot.sendMessage(chatId, channelJoin, {
                reply_markup: {
                    keyboard: [
                        [{text: joined[2]}]
                    ],
                    resize_keyboard: true,
                    one_time_keyboard: true
                }
            });
        } else {
            console.log("is it in else ?");
            try {
                await axios.post('http://localhost:3001/start', {
                    username: username,
                    name: name,
                    surName: surName,
                    sexuality: "",
                    age: "",
                    textGeneratorChannel: true,
                    idChat: msg.from.id
                });
                await bot.sendMessage(chatId, welcomeMessage[0]);
            } catch (error) {
                console.error('Error sending data to server:', error);
                await bot.sendMessage(chatId, error);
            }
            await sendCustomMessage(bot, chatId);
        }
        userStates.set(chatId, {
            isCreatingTherapySession: false,
            isRequestingEndingTherapy: false,
            findingLastTherapySession: false,
            isCompletingProfile: false,
            isInvitingFriend: false,
            threadId: "",
            lastText: "",
            tone: "",
            textTone: ""
        });

    } else if (text === createTherapy[1]) {

    } else if (text === joined[2]) {
        console.log("this is id " + msg.from.id);
        // Check if the user is a member of the channel
        let isMember = await checkChannelMembership(chatId, msg.from.id);
        let isMember2 = await checkChannelMembership2(chatId, msg.from.id);
        if (isMember && isMember2) {

            try {
                await axios.post('http://localhost:3001/start', {
                    username: username,
                    name: name,
                    surName: surName,
                    sexuality: "",
                    age: "",
                    textGeneratorChannel: true,
                    idChat: msg.from.id
                });
                await bot.sendMessage(chatId, welcomeMessage[0]);
            } catch (error) {
                console.error('Error sending data to server:', error);
                await bot.sendMessage(chatId, error);
            }

            // await bot.sendMessage(chatId, welcomeMessage);
            await sendCustomMessage(bot, chatId);


        } else {
            bot.sendMessage(chatId, channelJoin, {
                reply_markup: {
                    keyboard: [
                        [{text: joined[2]}]
                    ],
                    resize_keyboard: true,
                    one_time_keyboard: true
                }
            });
        }
    } else if (text === mainMenu[2]) {
        userStates.set(chatId, {
            ...userState,
            lastText: "",
            isCreatingTherapySession: false,
            isRequestingEndingTherapy: false,
            findingLastTherapySession: false,
            threadId: "",
        });
        await sendCustomMessage(bot, chatId);
    } else {
    }
});


async function sendCustomMessage(bot, chatId) {
    await bot.sendMessage(chatId, promoteUs[2], {
        reply_markup: {
            keyboard: [
                [{text: createTherapy[0]}],
                [{text: createTherapy[1]}],
                [{text: createTherapy[2]}],
                [{text: userProfile[2]}],
                [{text: aboutUs[2]}]
            ],
            resize_keyboard: true,
            one_time_keyboard: true
        }
    });
}


async function checkChannelMembership(chatId, userId) {
    try {
        const member = await bot.getChatMember(channelUsername, userId);
        return member && (member.status === 'member' || member.status === 'administrator' || member.status === 'creator');
    } catch (error) {
        console.error('Error checking channel membership:', error);
        bot.sendMessage(chatId, 'خطا در بررسی عضویت کانال.');
        return false;
    }
}

async function checkChannelMembership2(chatId, userId) {
    try {
        const member = await bot.getChatMember(channelUsername2, userId);
        return member && (member.status === 'member' || member.status === 'administrator' || member.status === 'creator');
    } catch (error) {
        console.error('Error checking channel membership:', error);
        bot.sendMessage(chatId, 'خطا در بررسی عضویت کانال.');
        return false;
    }
}
