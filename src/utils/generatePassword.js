
const generatePassword = (
    length = 8
) => {

    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    const lowercase = "abcdefghijklmnopqrstuvwxyz";

    const numbers = "0123456789";

    const symbols = "@$!%*?&#";

    const allCharacters = uppercase + lowercase + numbers + symbols;

    let password = "";

    password += uppercase[
        Math.floor(Math.random() * uppercase.length)
    ];

    password += lowercase[
        Math.floor(Math.random() * lowercase.length)
    ];

    password += numbers[
        Math.floor(Math.random() * numbers.length)
    ];

    password += symbols[
        Math.floor(Math.random() * symbols.length)
    ];

    // remaining characters
    for (let i = password.length; i < length; i++) {

        password += allCharacters[
            Math.floor(Math.random() * allCharacters.length)
        ];

    }

    // shuffle password
    password = password.split("").sort(() => Math.random() - 0.5).join("");

    return password;

};

module.exports = {
    generatePassword,
};