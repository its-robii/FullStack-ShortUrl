const generateShortId = require("../../helpers/generateShortId");
const isUrlValid = require("../../helpers/isUrlValid");
const RegistrationSchema = require("../../modal/RegistrationSchema");
const ShortUrlSchema = require("../../modal/ShortUrlSchema");
// Define baseUrl ONCE at the top (remove the duplicate inside the function)
const baseUrl = process.env.BASE_URL || "http://localhost:8000";

const MakeShortUrl = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.render("index", { error: "URL is required!" });
    }
    if (!isUrlValid(url)) {
      return res.render("index", { error: "URL is not valid!" });
    }

    const shorted = generateShortId(url);

    if (req.user) {
      const existUrl = await ShortUrlSchema.findOneAndUpdate(
        { url },
        { $set: { shortID: shorted } },
        { new: true }
      );

      if (existUrl) {
        return res.render("index", {
          message: "Short Url created successfully!",
          longUrl: existUrl.url,
          // Use baseUrl directly (no need for process.env.BASE_URL)
          shortUrl: `${baseUrl}/${existUrl.shortID}`, // Add missing `/`
          baseUrl,
          loggedUser: req.user,
        });
      }

      const shortUrl = new ShortUrlSchema({
        url: url,
        shortID: shorted,
        isAuth: true,
      });

      await shortUrl.save();
      await RegistrationSchema.findByIdAndUpdate(req.user.id, {
        $push: { shortUrls: shortUrl._id },
      });

      res.render("index", {
        message: "Short Url created successfully!",
        longUrl: shortUrl.url,
        shortUrl: `${baseUrl}/${shortUrl.shortID}`, // Fixed
        loggedUser: req.user,
        baseUrl
      });
    } else {
      const existUrl = await ShortUrlSchema.findOneAndUpdate(
        { url },
        { $set: { shortID: shorted } },
        { new: true }
      );

      if (existUrl) {
        return res.render("index", {
          message: "Short Url created successfully!",
          longUrl: existUrl.url,
          shortUrl: `${baseUrl}/${existUrl.shortID}`, // Fixed extra `}`
          baseUrl
        });
      }

      const shortUrl = new ShortUrlSchema({
        url: url,
        shortID: shorted,
      });

      await shortUrl.save();

      res.render("index", {
        message: "Short Url created successfully!",
        longUrl: shortUrl.url,
        shortUrl: `${baseUrl}/${shortUrl.shortID}`, // Fixed
        baseUrl
      });
    }
  } catch (error) {
    return res.status(400).send({ error: "Server side error! Please try again" });
  }
};

module.exports = MakeShortUrl;