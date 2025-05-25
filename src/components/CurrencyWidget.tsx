import React, { useEffect, useState } from 'react';
import { getCurrency } from '../services/NewsHttpService';
import { IExchangeRateResponse } from '../models/ExchangeRateResponse.interface';

export const CurrencyWidget: React.FC = () => {
  const [articles, setArticles] = useState<any[]>([]);
  const [selectedCurrencyId, setSelectedCurrencyId] = useState<string>('USD');

  const categories: any[] = [
      { id: '', name: 'All categories' },
      { id: 'business', name: 'Business' },
      { id: 'entertainment', name: 'Entertainment' },
      { id: 'general', name: 'General' },
      { id: 'health', name: 'Health' },
      { id: 'science', name: 'Science' },
      { id: 'sports', name: 'Sports' },
      { id: 'technology', name: 'Technology' },
  ];

  useEffect(() => {
      fetchCurrency(selectedCurrencyId);
  }, [selectedCurrencyId]);

  const fetchCurrency = async (categoryId: string) => {
      try {
          // const data: IExchangeRateResponse = await getCurrency(categoryId);
          const data: IExchangeRateResponse = await getCurrency();
          setArticles(data.articles);
      } catch (error) {
          console.error(error);
      }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedCurrencyId(e.target.value);
  };

  return (
      <div className="news-widget">
          <select value={selectedCurrencyId} onChange={handleCategoryChange}>
              {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
              ))}
          </select>

          <div className="articles">
              {articles.map((article, index) => (
                  <div key={index} className="article-card">
                      <h3>{article.title}</h3>
                      {article.urlToImage && <img src={article.urlToImage} alt={article.title} />}
                      <p>{article.description}</p>
                      <a href={article.url} target="_blank" rel="noopener noreferrer">Read more</a>
                  </div>
              ))}
          </div>
      </div>
  );
};
