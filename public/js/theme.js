const rootStyle = document.querySelector(":root").style;

const changeTheme = (theme) => {
    rootStyle.setProperty("--main-bg", theme.mainBg);
    rootStyle.setProperty("--chat-bg", theme.chatBg);
    rootStyle.setProperty("--from-bg", theme.fromBg);
    rootStyle.setProperty("--to-bg", theme.toBg);
    rootStyle.setProperty("--from-font", theme.fromFont);
    rootStyle.setProperty("--to-font", theme.toFont);
    rootStyle.setProperty("--button-bg", theme.buttonBg);
    rootStyle.setProperty("--button-font", theme.buttonFont);
    rootStyle.setProperty("--username-font", theme.usernameFont);
}
