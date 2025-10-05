import React, { useState, useEffect } from 'react';
import CardItem from './CardItem';

interface Card {
  _id: string;
  cardNumber: string;
  cardBrand: string;
  cardholderName?: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
  createdAt: string;
}

interface CardListProps {
  onAddCard?: () => void;
}

const CardList: React.FC<CardListProps> = ({ onAddCard }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCards = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/cards');
      if (!response.ok) {
        throw new Error('Failed to fetch cards');
      }
      const data = await response.json();
      setCards(data.cards || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch cards');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const handleSetDefault = async (cardId: string) => {
    try {
      const response = await fetch(`/api/cards/${cardId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isDefault: true }),
      });

      if (!response.ok) {
        throw new Error('Failed to set default card');
      }

      // Refresh the cards list
      await fetchCards();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to set default card');
    }
  };

  const handleDelete = async (cardId: string) => {
    if (!confirm('Are you sure you want to delete this card?')) {
      return;
    }

    try {
      const response = await fetch(`/api/cards/${cardId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete card');
      }

      // Refresh the cards list
      await fetchCards();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete card');
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="rounded-xl border border-white/30 bg-white/10 backdrop-blur-xl p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchCards}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-100 flex items-center justify-center">
          <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">No payment methods</h3>
        <p className="text-slate-600 mb-4">Add a payment method to make purchases and manage subscriptions.</p>
        {onAddCard && (
          <button
            onClick={onAddCard}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 transform hover:scale-105"
          >
            Add Payment Method
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {cards.map((card) => (
        <CardItem
          key={card._id}
          _id={card._id}
          cardNumber={card.cardNumber}
          cardBrand={card.cardBrand}
          cardholderName={card.cardholderName}
          expiryMonth={card.expiryMonth}
          expiryYear={card.expiryYear}
          isDefault={card.isDefault}
          onSetDefault={handleSetDefault}
          onDelete={handleDelete}
        />
      ))}

      {onAddCard && cards.length > 0 && (
        <div className="pt-4 border-t border-white/20">
          <button
            onClick={onAddCard}
            className="w-full flex items-center justify-center px-4 py-3 text-sm font-medium text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-lg border border-orange-200 transition-all duration-200"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Another Payment Method
          </button>
        </div>
      )}
    </div>
  );
};

export default CardList;
