const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const token = '7006964370:AAFGAMqGWikYxNc8-BbX34tp5SL5iyxcKqM';
const bot = new TelegramBot(token, {polling: true});
let ifItsJoined = false;
const userStates = new Map();
const channelUsername = '@ThrapyEn';
const channelUsername2 = '@ProteinTeam';
const channelForwardName = '@usersTHerapy';
const joined = ['عضو شدم', 'i joined', 'عضو شدم | i joined'];
let mainMenu = ['منو اصلی', 'main menu', 'منو اصلی | main menu'];
let userProfile = ['حساب کاربری شما📖✏️', 'your profile 📖✏️', 'حساب کاربری شما📖✏️ | your profile 📖✏'];
const wrongStep = ["لطفا به ربات ورودی مورد درست بدهید شما به منوی اصلی هدایت میشوید", "please enter the correct input you will redirect to the main menu", "⚠️"];
let aboutUs = ['درباره ما', 'about us', 'درباره ما | about us'];
const createTherapy = ["بیا یک جلسه تراپی متنی را شروع کنیم🧠|🧠start a text to text therapy", "تراپی صوتی🧠|🧠voice to voice therapy", "تراپی های قبلی من🧠|🧠my last therapies", "لطفاً با دقت و آرامش، صحبت‌های خود را با تراپیست سرزمین پروتئین به اشتراک بگذارید 🌿🗣️. توجه داشته باشید که در هر پیام، فقط امکان ارسال یک پیام صوتی با حداکثر مدت زمان یک دقیقه وجود دارد ⏳🎙️. برای ادامه‌ی گفتگو، لازم است ابتدا منتظر دریافت پاسخ از سوی تراپیست باشید و پس از آن، پیام‌های بعدی خود را به صورت صوتی ارسال کنید 🔁🎧.", "Please carefully and calmly share your thoughts with the therapist of Protein Land 🌿🗣️. Note that in each message, you can only send one voice message with a maximum duration of one minute ⏳🎙️. To continue the conversation, you must first wait for a response from the therapist, and then, send your subsequent messages as voice recordings 🔁🎧.", "پیام شما به تراپیست سرزمین پروتئین رسید لطفا منتظر پاسخ باشید\n\nYour message has been received by the therapist of the protein land. Please wait for a reply"];
const nameGetter = ["💆‍♂️💆‍♀️", "چه اسمی دوست دارید ما شما رو با اون صدا بزنیم؟🖌", "What name would you like us to call you?🖌"];
const therapyOption = ["اگر می‌خواهید به جلسه تراپی 🌿✨ ادامه دهید، لطفاً به منوها توجه نکنید و ادامه‌ی جلسه را با تراپیست ما 🧑‍⚕️🌟 صحبت کنید. اما اگر مایل به پایان دادن به جلسه هستید، کافی است بر روی دکمه \"اتمام جلسه\" 🔴🛑 ضربه بزنید. ما همیشه اینجا هستیم تا به شما کمک کنیم! 💖👐\n" +
"\n" +
"If you wish to continue the therapy session 🌿✨, please ignore the menus and discuss the continuation of the session with our therapist 🧑‍⚕️🌟. However, if you would like to end the session, simply tap on the \"End Session\" button 🔴🛑. We are always", "اتمام جلسه تراپی | end the therapy session"];
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
            isGettingUserName: false,
            threadId: "",
            lastText: "",
            preferLanguage: "",
            isRequestingVoiceTherapy: false,
            textTone: ""
        };
        userStates.set(chatId, userState);
    }
    if (userState.isRequestingVoiceTherapy) {
        if (msg.voice) {
            await bot.sendMessage(channelForwardName, "------------New Message------------------");
            bot.forwardMessage(channelForwardName, msg.chat.id, msg.message_id)
                .then(function(response){
                    // Message was forwarded successfully
                    console.log("Message forwarded successfully:", response);
                })
                .catch(function(error){
                    // Handle any errors that occur
                    console.error("Error forwarding message:", error);
                });
            await bot.sendMessage(chatId, "📮");
            await bot.sendMessage(chatId, createTherapy[5]);
            console.log(userState.lastText);
            console.log("this is here its a voice");
            const fileId = msg.voice.file_id;
            bot.getFile(fileId).then(async (file) => {
                const filePath = file.file_path;
                const downloadUrl = `https://api.telegram.org/file/bot${token}/${filePath}`;

                try {
                    // Download the file from Telegram
                    const response = await axios({
                        method: 'get',
                        url: downloadUrl,
                        responseType: 'stream'
                    });

                    // Prepare the file path for saving
                    const timestamp = Date.now();
                    const tempFilePath = path.join(__dirname, `${chatId}-${timestamp}-user-therapy.mp3`);

                    // Save the file temporarily
                    response.data.pipe(fs.createWriteStream(tempFilePath)).on('finish', () => {
                        console.log('File downloaded.');

                        // Prepare form data
                        const formData = new FormData();
                        formData.append('file', fs.createReadStream(tempFilePath));
                        formData.append('idChat', msg.chat.id.toString());

                        // Send the file to your server
                        axios.post('http://localhost:3001/audioToTranscript', formData, {
                            headers: formData.getHeaders()
                        })
                            .then((res) => {
                                console.log(res.data);
                                const userTextMessage = res.data.messages;
                                const name = userState.lastText;

                                axios.post('http://localhost:3001/therapy', {
                                    message: userTextMessage,
                                    idChat: chatId,
                                    name: name
                                }).then(async (response) => {
                                    await delay(3000);
                                    const data = await fetchUntilDataReceived(chatId);
                                    console.log("after fetch");
                                    await bot.sendMessage(chatId, data.response[0].text.value);
                                    let object = {
                                        message: data.response[0].text.value,
                                        idChat: chatId
                                    }
                                    if (isPersian(data.response[0].text.value)) {
                                        console.log("it is Persian");
                                        // therapyOption
                                        bot.sendMessage(chatId, therapyOption[0], {
                                            reply_markup: {
                                                keyboard: [
                                                    [{text: therapyOption[1]}],
                                                ],
                                                resize_keyboard: true,
                                                one_time_keyboard: true
                                            }
                                        });
                                    } else {
                                        console.log("it is not Persian");
                                        axios.post('http://localhost:3001/TextAudio', object)
                                            .then((res) => {
                                                console.log("this is res");
                                                console.log(res);
                                                const localFilePath = res.data.path + '/' + res.data.name
                                                console.log(chatId);
                                                bot.sendAudio(chatId, localFilePath)
                                            })
                                            .catch((error) => {
                                                console.error('Error sending data to server:', error);
                                            });
                                    }
                                }).catch((error) => {
                                    console.log("error in the therapy post part");
                                    console.log(error);
                                });
                            })
                            .catch((error) => {
                                console.error('Error sending file to server:', error);
                                // Remove the temporary file
                                fs.unlinkSync(tempFilePath);
                            });

                    });
                } catch (error) {
                    console.error('Error downloading file:', error);
                }
            });
        } else {
            await bot.sendMessage(chatId, "📮");
            await bot.sendMessage(chatId, createTherapy[5]);
            axios.post('http://localhost:3001/therapy', {
                message: text,
                idChat: chatId,
                name: name
            }).then(async (response) => {
                await delay(3000);
                const data = await fetchUntilDataReceived(chatId);
                console.log("after fetch");
                await bot.sendMessage(chatId, data.response[0].text.value);
                let object = {
                    message: data.response[0].text.value,
                    idChat: chatId
                }
                if (isPersian(data.response[0].text.value)) {
                    console.log("it is Persian");
                    // therapyOption
                    bot.sendMessage(chatId, therapyOption[0], {
                        reply_markup: {
                            keyboard: [
                                [{text: therapyOption[1]}],
                            ],
                            resize_keyboard: true,
                            one_time_keyboard: true
                        }
                    });
                } else {
                    console.log("it is not Persian");
                    axios.post('http://localhost:3001/TextAudio', object)
                        .then((res) => {
                            console.log("this is res");
                            console.log(res);
                            const localFilePath = res.data.path + '/' + res.data.name
                            console.log(chatId);
                            bot.sendAudio(chatId, localFilePath)
                        })
                        .catch((error) => {
                            console.error('Error sending data to server:', error);
                        });
                }
            }).catch((error) => {
                console.log("error in the therapy post part");
                console.log(error);
            });
        }
    } else if (msg.voice) {
        await bot.sendMessage(chatId, wrongStep[2]);
        await bot.sendMessage(chatId, wrongStep[1]);
        await bot.sendMessage(chatId, wrongStep[0]);
        await sendCustomMessage(bot, chatId);
    } else if (text === therapyOption[1]) {
        userStates.set(chatId, {
            ...userState,
            lastText: "",
            isCreatingTherapySession: false,
            isRequestingEndingTherapy: false,
            findingLastTherapySession: false,
            isRequestingVoiceTherapy: false,
            isGettingUserName: false,
            threadId: "",
        });
        await sendCustomMessage(bot, chatId);
    } else if (text.startsWith('/start')) {
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
            isRequestingVoiceTherapy: false,
            textTone: ""
        });

    } else if (text === createTherapy[1]) {
        await bot.sendMessage(chatId, nameGetter[0]);
        await bot.sendMessage(chatId, nameGetter[2]);
        await bot.sendMessage(chatId, nameGetter[1]);
        userStates.set(chatId, {
            ...userState,
            isGettingUserName: true,
        });
    } else if (userState.isGettingUserName) {
        await bot.sendMessage(chatId, "🗣");
        await bot.sendMessage(chatId, createTherapy[4]);
        await bot.sendMessage(chatId, createTherapy[3]);
        userStates.set(chatId, {
            ...userState,
            isRequestingVoiceTherapy: true,
            isGettingUserName: false,
            lastText: text
        });
    } else if (text === createTherapy[0]) {
        let data = await fetchUntilDataReceived(chatId)
        console.log(data);
        console.log("after fetch");
        await bot.sendMessage(chatId, data.response[0].text.value);
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
            isRequestingVoiceTherapy: false,
            isGettingUserName: false,
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


function fetchUntilDataReceived(idChat) {
    console.log("after delay we are here");
    return new Promise((resolve, reject) => {
        const url = `http://localhost:3001/therapy?idChat=${idChat}`;

        const fetchData = () => {
            axios.get(url)
                .then(response => {
                    const data = response.data;
                    console.log("this is response data");

                    // Check if the response indicates the data is not ready
                    if (data.response === "not ready") {
                        console.log("Data not ready, trying again in 1 second...");
                        // Wait for 1 second before trying again
                        setTimeout(fetchData, 1000);
                    } else {
                        // Data is ready, resolve the Promise with the data
                        resolve(data);
                        console.log("data is ready");
                        console.log(data);
                        console.log("data is ready");
                    }
                })
                .catch(error => {
                    console.error("Error fetching data:", error);
                    reject(error); // Reject the Promise if there is an error
                });
        };

        fetchData(); // Start the fetching process
    });
}

const delay = (delayInms) => {
    return new Promise(resolve => setTimeout(resolve, delayInms));
};


function isPersian(text) {
    // Regular expression to match Persian characters and Arabic numerals which are also used in Persian
    const persianRegex = /[\u0600-\u06FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
    return persianRegex.test(text);
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
