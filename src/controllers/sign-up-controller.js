import User from "../models/User.js";
import bcrypt from "bcrypt";
import createUserToken from "../utils/create-user-token.js";

class SignUpController {
  static async signUp(req, res) {
    try {
      const { name, email, password, confirmPassword } = req.body;

      if (!name) {
        return res.status(422).json({ message: "O nome é obrigatório." });
      }

      if (!email) {
        return res.status(422).json({ message: "O email é obrigatório." });
      }

      if (!password) {
        return res.status(422).json({ message: "A senha é obrigatória." });
      }

      const passwordRegex =
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

      if (!passwordRegex.test(password)) {
        return res.status(422).json({
          message:
            "A senha deve ter pelo menos 8 caracteres e conter pelo menos uma letra, um número e um caractere especial.",
        });
      }

      if (!confirmPassword) {
        return res
          .status(422)
          .json({ message: "A confirmação de senha é obrigatória." });
      }

      if (password !== confirmPassword) {
        return res.status(422).json({ message: "As senhas não conferem." });
      }

      const salt = await bcrypt.genSalt(10);

      const passwordHash = await bcrypt.hash(password, salt);

      const userExists = await User.findOne({ email });

      if (userExists) {
        return res.status(422).json({ message: "Esse usuário já existe." });
      }

      const emailExists = await User.findOne({ email });

      if (emailExists) {
        return res.status(422).json({ message: "Email já cadastrado." });
      }

      const user = new User({
        name,
        email,
        password: passwordHash,
      });

      const newUser = await user.save();

      const userToken = await createUserToken(newUser);

      res.cookie("token", userToken, {
        path: "/",
        expires: new Date(Date.now() + 86400000),
        secure: true,
        httpOnly: true,
        sameSite: "None",
      });

      res.status(201).json({
        message: "Usuário criado com sucesso!",
        newUser,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro interno de servidor." });
    }
  }
}

export default SignUpController;
