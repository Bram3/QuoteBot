import { AxiosError } from "axios";
import { Quote } from "../entities/Quote";
import logger from "../utils/Logger";

const axios = require("axios").default;

// We need to fetch data from the quote API. This repository centralizes all the data from the quotes api.
export class QuoteRepository {
  private baseUrl = "https://api.quotable.io/random";

  async getRandomQuotes(amount: number): Promise<Quote[] | null> {
    try {
      // put all the requests on a array so we can later wait for all of them to finish
      let requests = [];
      try {
        for (let i = 0; i < amount; i++) {
          requests.push(await axios(this.baseUrl));
        }
      } catch (e) {
        if (e instanceof AxiosError) {
          if (e.response?.status === 404) {
            return [];
          }
        }
        return null;
      }

      // wait for all requests to finish
      const repsonses = await Promise.all(requests);

      // return an array of quotes
      return repsonses.map((response) => {
        return new Quote(
          response.data.content,
          response.data.author,
          response.data.authorSlug,
          response.data.length,
          response.data.tags
        );
      });
    } catch (e) {
      // if there is an error return null
      logger.error(e);
      return null;
    }
  }

  async getRandomQuotesWithTag(
    tag: string,
    amount: number
  ): Promise<Quote[] | null> {
    try {
      // put all the requests on a array so we can later wait for all of them to finish
      let requests = [];
      try {
        for (let i = 0; i < amount; i++) {
          requests.push(await axios(`${this.baseUrl}?tags=${tag}`));
        }
      } catch (e) {
        if (e instanceof AxiosError) {
          if (e.response?.status === 404) {
            return [];
          }
        }
        return null;
      }

      // wait for all requests to finish
      const repsonses = await Promise.all(requests);

      // return an array of quotes
      return repsonses.map((response) => {
        return new Quote(
          response.data.content,
          response.data.author,
          response.data.authorSlug,
          response.data.length,
          response.data.tags
        );
      });
    } catch (e) {
      // if there is an error return null
      logger.error(e);
      return null;
    }
  }
}
