
const { Telegraf, Markup, Scenes, session } = require("telegraf");
const { BaseScene, Stage } = Scenes;
const token = "6836807647:AAHc0okqytobOSaz0gBITjEFRjGHMA4qM6g";
if (token === undefined) {
  throw new Error("BOT_TOKEN must be provided!");
}
const bot = new Telegraf(token);

function escapeMarkdown(text) {
  return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, "\\$&");
}

// مشهد اختيار الفئة
const categoryScene = new BaseScene("category");
categoryScene.enter((ctx) => {
  ctx.reply(
    "يرجى اختيار الفئة:",
    Markup.inlineKeyboard([
      [{ text: "🌳 فئة 1", callback_data: "category1" }],
      [{ text: "🌴 فئة 2", callback_data: "category2" }],
    ])
  );
});
categoryScene.on("callback_query", async (ctx) => {
  ctx.session.category = ctx.callbackQuery.data;
  await ctx.answerCbQuery("تم اختيار الفئة بنجاح.");
  await ctx.scene.enter("product");
});


// مشهد اختيار المنتج
const productScene = new BaseScene("product");
productScene.enter(async (ctx) => {
  const products =
    ctx.session.category === "category1"
      ? ["🌿 منتج 1-1", "🍃 منتج 1-2", "🍀 منتج 1-3"]
      : ["🌾 منتج 2-1", "🌱 منتج 2-2", "🍂 منتج 2-3"];

  await ctx.reply(
    "يرجى اختيار المنتج:",
    Markup.inlineKeyboard(
      products.map((product) => [{ text: product, callback_data: product }])
    )
  );
});
productScene.on("callback_query", async (ctx) => {
  ctx.session.productName = ctx.callbackQuery.data;
  await ctx.answerCbQuery("تم اختيار المنتج بنجاح.");
  await ctx.scene.enter("quantity");
});


// مشهد إدخال الكمية

const quantityScene = new BaseScene("quantity");

quantityScene.enter(async (ctx) => {
  console.log("Entered quantity scene");
  ctx.session.quantity = "";
  await ctx.reply(
    "يرجى إدخال الكمية المطلوبة :",
    Markup.inlineKeyboard([
      [
        { text: "1️⃣", callback_data: "quantity_1" },
        { text: "2️⃣", callback_data: "quantity_2" },
        { text: "3️⃣", callback_data: "quantity_3" },
      ],
      [
        { text: "4️⃣", callback_data: "quantity_4" },
        { text: "5️⃣", callback_data: "quantity_5" },
        { text: "6️⃣", callback_data: "quantity_6" },
      ],
      [
        { text: "7️⃣", callback_data: "quantity_7" },
        { text: "8️⃣", callback_data: "quantity_8" },
        { text: "9️⃣", callback_data: "quantity_9" },
      ],
      [
        { text: "❌", callback_data: "quantity_delete" },
        { text: "0️⃣", callback_data: "quantity_0" },
        { text: "موافق ✅", callback_data: "confirm_quantity" },
      ],
    ])
  );
});

quantityScene.on("callback_query", async (ctx) => {
  const callbackData = ctx.callbackQuery.data;
  if (callbackData.startsWith("quantity_")) {
    const quantityPart = callbackData.split("_")[1];
    if (quantityPart === "delete") {
      // حذف آخر حرف
      ctx.session.quantity = ctx.session.quantity.slice(0, -1);
    } else {
      // إضافة الحرف المختار
      ctx.session.quantity += quantityPart;
    }
    await ctx.answerCbQuery();
    await ctx.editMessageText(
      `يرجى إدخال الكمية المطلوبة :\n\n${ctx.session.quantity}`,
      Markup.inlineKeyboard([
        [
          { text: "1️⃣", callback_data: "quantity_1" },
          { text: "2️⃣", callback_data: "quantity_2" },
          { text: "3️⃣", callback_data: "quantity_3" },
        ],
        [
          { text: "4️⃣", callback_data: "quantity_4" },
          { text: "5️⃣", callback_data: "quantity_5" },
          { text: "6️⃣", callback_data: "quantity_6" },
        ],
        [
          { text: "7️⃣", callback_data: "quantity_7" },
          { text: "8️⃣", callback_data: "quantity_8" },
          { text: "9️⃣", callback_data: "quantity_9" },
        ],
        [
          { text: "❌", callback_data: "quantity_delete" },
          { text: "0️⃣", callback_data: "quantity_0" },
          { text: "موافق ✅", callback_data: "confirm_quantity" },
        ],
      ])
    );
  } else if (callbackData === "confirm_quantity") {
    if (ctx.session.quantity) {
      await ctx.answerCbQuery();
      await ctx.scene.enter("phone");
    } else {
      await ctx.answerCbQuery("الرجاء إدخال كمية صحيحة.");
    }
  }
});


// مشهد إدخال رقم الهاتف
// const phoneScene = new BaseScene("phone");
// phoneScene.enter(async (ctx) => {
//   console.log("Entered phone scene");
//   ctx.session.phone = "";
//   await ctx.reply(
//     "يرجى إدخال رقم هاتفك لتأكيد الطلبية:",
//     Markup.inlineKeyboard([
//       ...Array.from({ length: 3 }, (_, i) => [
//         { text: `${i}`, callback_data: `phone_${i}` },
//       ]),
//       ...Array.from({ length: 3 }, (_, i) => [
//         { text: `${i}`, callback_data: `phone_${i}` },
//       ]),
//       [{ text: "موافق", callback_data: "confirm_phone" }],
//     ])
//   );
// });
// phoneScene.on("callback_query", async (ctx) => {
//   const callbackData = ctx.callbackQuery.data;
//   if (callbackData.startsWith("phone_")) {
//     const phonePart = callbackData.split("_")[1];
//     ctx.session.phone += phonePart;
//     await ctx.answerCbQuery();
//     await ctx.reply(`رقم هاتفك الحالي: ${ctx.session.phone}`);
//   } else if (callbackData === "confirm_phone") {
//     if (ctx.session.phone.length >= 10) {
//       // التحقق من أن رقم الهاتف يحتوي على 10 أرقام على الأقل
//       await ctx.answerCbQuery();
//       await ctx.reply(
//         `رقم هاتفك هو: ${ctx.session.phone}. هل هو صحيح؟`,
//         Markup.inlineKeyboard([
//           [{ text: "✅ تأكيد", callback_data: "confirm_all" }],
//           [{ text: "✏️ تعديل", callback_data: "edit_phone" }],
//         ])
//       );
//     } else {
//       await ctx.answerCbQuery(
//         "الرجاء إدخال رقم هاتف صحيح يحتوي على 10 أرقام على الأقل."
//       );
//     }
//   } else if (callbackData === "confirm_all") {
//     await ctx.answerCbQuery();
//     await ctx.reply(
//       `تم تأكيد طلبك: ${ctx.session.quantity} من ${ctx.session.productName} برقم الهاتف ${ctx.session.phone}. شكراً لتواصلك معنا!`
//     );
//     await ctx.scene.leave();
//   } else if (callbackData === "edit_phone") {
//     ctx.session.phone = "";
//     await ctx.answerCbQuery();
//     await ctx.scene.enter("phone");
//   }
// });

const phoneScene = new BaseScene("phone");

phoneScene.enter(async (ctx) => {
  console.log("Entered phone scene");
  ctx.session.phone = "";
  await ctx.reply(
    "يرجى إدخال رقم هاتفك لتأكيد الطلبية:",
    Markup.inlineKeyboard([
      [
        { text: "1️⃣", callback_data: "phone_1" },
        { text: "2️⃣", callback_data: "phone_2" },
        { text: "3️⃣", callback_data: "phone_3" },
      ],
      [
        { text: "4️⃣", callback_data: "phone_4" },
        { text: "5️⃣", callback_data: "phone_5" },
        { text: "6️⃣", callback_data: "phone_6" },
      ],
      [
        { text: "7️⃣", callback_data: "phone_7" },
        { text: "8️⃣", callback_data: "phone_8" },
        { text: "9️⃣", callback_data: "phone_9" },
      ],
      [
        { text: "❌", callback_data: "phone_delete" },
        { text: "0️⃣", callback_data: "phone_0" },
        { text: "موافق ✅", callback_data: "confirm_phone" },
      ],
    ])
  );
});

phoneScene.on("callback_query", async (ctx) => {
  const callbackData = ctx.callbackQuery.data;
  console.log(callbackData);
  if (callbackData.startsWith("phone_")) {
    const phonePart = callbackData.split("_")[1];
    if (phonePart === "delete") {
      // حذف آخر حرف
      ctx.session.phone = ctx.session.phone.slice(0, -1);
    } else {
      // إضافة الحرف المختار
      ctx.session.phone += phonePart;
    }
    await ctx.answerCbQuery();
    await ctx.editMessageText(
      `يرجى إدخال رقم هاتفك لتأكيد الطلبية:\n\n${formatPhone(
        ctx.session.phone
      )}`,
      Markup.inlineKeyboard([
        [
          { text: "1️⃣", callback_data: "phone_1" },
          { text: "2️⃣", callback_data: "phone_2" },
          { text: "3️⃣", callback_data: "phone_3" },
        ],
        [
          { text: "4️⃣", callback_data: "phone_4" },
          { text: "5️⃣", callback_data: "phone_5" },
          { text: "6️⃣", callback_data: "phone_6" },
        ],
        [
          { text: "7️⃣", callback_data: "phone_7" },
          { text: "8️⃣", callback_data: "phone_8" },
          { text: "9️⃣", callback_data: "phone_9" },
        ],
        [
          { text: "❌", callback_data: "phone_delete" },
          { text: "0️⃣", callback_data: "phone_0" },
          { text: "موافق ✅", callback_data: "confirm_phone" },
        ],
      ])
    );
  } else if (callbackData === "confirm_phone") {
    if (ctx.session.phone.length >= 10) {
      await ctx.answerCbQuery();
      await ctx.reply(
        `رقم هاتفك هو: ${ctx.session.phone}. هل هو صحيح؟`,
        Markup.inlineKeyboard([
          [{ text: "✅ تأكيد", callback_data: "confirm_all" }],
          [{ text: "✏️ تعديل", callback_data: "edit_phone" }],
        ])
      );
    } else {
      await ctx.answerCbQuery(
        "الرجاء إدخال رقم هاتف صحيح يحتوي على 10 أرقام على الأقل."
      );
    }
  }else if (callbackData === "confirm_all") {
    await ctx.answerCbQuery();
    await ctx.reply(
      `تم تأكيد طلبك: ${ctx.session.quantity} من ${ctx.session.productName} برقم الهاتف ${ctx.session.phone}. شكراً لتواصلك معنا!`
    );
    console.log(ctx.session);
    await ctx.scene.leave();
  } else if (callbackData === "edit_phone") {
    ctx.session.phone = "";
    await ctx.answerCbQuery();
    await ctx.scene.enter("phone");
  }
});



// تنسيق رقم الهاتف
function formatPhone(phone) {
  return phone.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
}

// إضافة تعامل مع الإدخال النصي من لوحة المفاتيح
phoneScene.on("text", async (ctx) => {
  const phoneInput = ctx.message.text;
  if (/^\d{10,}$/.test(phoneInput)) {
    ctx.session.phone = phoneInput;
    await ctx.reply(
      `رقم هاتفك هو: ${ctx.session.phone}. هل هو صحيح؟`,
      Markup.inlineKeyboard([
        [{ text: "✅ تأكيد", callback_data: "confirm_all" }],
        [{ text: "✏️ تعديل", callback_data: "edit_phone" }],
      ])
    );
  } else {
    await ctx.reply("الرجاء إدخال رقم هاتف صحيح يحتوي على 10 أرقام على الأقل.");
  }
});


// إعداد المراحل (scenes)
const stage = new Stage([
  categoryScene,
  productScene,
  quantityScene,
  phoneScene,
]);
bot.use(session());
bot.use(stage.middleware());

// Start command handler
bot.start((ctx) => {
  ctx.reply(
    "مرحبًا بك في دعم عملاء شركة 29 العالمية في تايلاند! كيف يمكننا مساعدتك اليوم؟",
    Markup.keyboard([
      ["📖 من نحن", "💼 خدماتنا", "🛍 منتجاتنا", "📝 طلب منتج"],
      ["📰 لقاءات وأخبار", "🎥 فيديو", "📸 صور", "❓ مساعدة"],
    ]).resize()
  );
});

bot.hears("📖 من نحن", (ctx) => {
  ctx.replyWithMarkdownV2(
    "*شركة 29 العالمية*\n\n" +
      escapeMarkdown(
        "نحن شركة تايلاندية بإدارة عربية يقع مقرنا في قلب العاصمة بانكوك بمملكة تايلاند. نختص في زراعة وبيع وتصدير الأشجار بما في ذلك خدمات الشحن والجمارك والتوصيل إلى باب المشتري.\n\n"
      ),
    {
      reply_markup: {
        inline_keyboard: [
          [{ text: "تعرف علينا أكثر", url: "https://29.co.th/#about" }],
        ],
      },
    }
  );
});

bot.hears("💼 خدماتنا", (ctx) => {
  ctx.reply("يرجى اختيار خدمة للمزيد من المعلومات:", {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "🌱 خدمة الزراعة", callback_data: "agriculture" },{ text: "🚛 الخدمات اللوجستية", callback_data: "logistics" }
          ],[{
            text: "📦 تصدير وتوريد الأشجار والنباتات",
            callback_data: "export",
          }
          ,
        ],
      ],
    },
  });
});



bot.action("agriculture", (ctx) => {
  console.log("Agriculture action");
  ctx.replyWithMarkdownV2(
    "*🌱 خدمة الزراعة*\n\n" +
      escapeMarkdown(
        "نوفر لكم خدمة زراعة ونباتات الأشجار في مزارعنا بمملكة تايلاند لجميع الأنواع والأعداد المطلوبة."
      )
  );
});

bot.action("export", (ctx) => {
  console.log("Export action");
  ctx.replyWithMarkdownV2(
    "*تصدير وتوريد الأشجار والنباتات*\n\n" +
      escapeMarkdown(
        "بيع الأشجار وتنوعها وحجماتها وشحنها إلى جميع الدول العربية بأسعار مميزة وجودة ممتازة."
      )
  );
});

bot.action("logistics", (ctx) => {
  console.log("Logistics action");
  ctx.replyWithMarkdownV2(
    "*الخدمات اللوجستية*\n\n" +
      escapeMarkdown(
        "نوفر خدمات الشحن الجمركي الشاملة والضرائب والتوصيل إلى باب المشتري."
      )
  );
});

// Our Products command handler
bot.hears("🛍 منتجاتنا", (ctx) => {
  console.log("منتجاتنا command");
  ctx.reply("اكتشف مجموعة منتجاتنا وميزاتها.");
});

// Events & News command handler
bot.hears("📰 لقاءات وأخبار", (ctx) => {
  console.log("لقاءات وأخبار command");
  ctx.reply("ابقَ على اطلاع بآخر الأحداث والأخبار لدينا.");
});

// Videos command handler
bot.hears("🎥 فيديو", (ctx) => {
  console.log("فيديو command");
  ctx.reply("شاهد فيديوهاتنا الترويجية والتعليمية.");
});

// Photos command handler
bot.hears("📸 صور", (ctx) => {
  console.log("صور command");
  ctx.reply("شاهد صور مزرعتنا وعملياتنا.");
});

// Help command handler
bot.hears("❓ مساعدة", (ctx) => {
  console.log("مساعدة command");
  ctx.reply(
    "إذا كنت بحاجة إلى مساعدة، يرجى كتابة رسالتك وسنقوم بالرد في أقرب وقت ممكن."
  );
});

// Order Product command handler
bot.hears("📝 طلب منتج", (ctx) => {
  console.log("طلب منتج command");
  ctx.scene.enter("category");
});

// Handle incoming messages
bot.on("text", (ctx) => {
  // Handle the incoming message here
  const message = ctx.message.text;
  console.log("Received text message:", message);
  // Example: Respond with a generic message
  ctx.reply("شكرًا لتواصلك معنا. سنقوم بالرد في أقرب وقت.");
});

// Start the bot
bot.launch();

bot.catch((err, ctx) => {
  console.log(`Error for ${ctx.updateType}`, err);
});
