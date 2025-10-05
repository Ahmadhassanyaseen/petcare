import React from 'react';
import { BsCreditCard, BsStar, BsStarFill, BsTrash } from 'react-icons/bs';

interface CardItemProps {
  _id: string;
  cardNumber: string;
  cardBrand: string;
  cardholderName?: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
  onSetDefault?: (cardId: string) => void;
  onDelete?: (cardId: string) => void;
}

const getCardIcon = (brand: string) => {
  // You can add more card brand icons here
  switch (brand.toLowerCase()) {
    case 'visa':
      return '💳';
    case 'mastercard':
      return '💳';
    case 'amex':
    case 'american_express':
      return '💳';
    default:
      return '💳';
  }
};

const CardItem: React.FC<CardItemProps> = ({
  _id,
  cardNumber,
  cardBrand,
  cardholderName,
  expiryMonth,
  expiryYear,
  isDefault,
  onSetDefault,
  onDelete,
}) => {
  return (
    <div className="relative rounded-xl border border-white/30 bg-white/10 backdrop-blur-xl shadow overflow-hidden hover:bg-white/15 transition-all duration-200">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-100 to-orange-200 flex items-center justify-center text-lg">
              {getCardIcon(cardBrand)}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-slate-900 capitalize">
                  {cardBrand}
                </span>
                {isDefault && (
                  <BsStarFill className="w-4 h-4 text-orange-500" />
                )}
              </div>
              <p className="text-xs text-slate-600">
                {cardholderName ? `Cardholder: ${cardholderName}` : '•••• •••• •••• ' + cardNumber.slice(-4)}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {!isDefault && onSetDefault && (
              <button
                onClick={() => onSetDefault(_id)}
                className="p-1.5 rounded-lg bg-orange-100 hover:bg-orange-200 transition-colors"
                title="Set as default"
              >
                <BsStar className="w-4 h-4 text-orange-600" />
              </button>
            )}

            {onDelete && (
              <button
                onClick={() => onDelete(_id)}
                className="p-1.5 rounded-lg bg-red-100 hover:bg-red-200 transition-colors"
                title="Delete card"
              >
                <BsTrash className="w-4 h-4 text-red-600" />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">
            Expires {expiryMonth.toString().padStart(2, '0')}/{expiryYear.toString().slice(-2)}
          </span>
          <span className="font-mono text-slate-900">
            •••• {cardNumber.slice(-4)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CardItem;
