import React, { useState } from 'react';

interface Contract {
  id: string;
  title: string;
  contractType: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  analysis?: {
    summary: string;
    risks: string[];
    recommendations: string[];
  };
}

interface ContractCardProps {
  contract: Contract;
  onDelete: (id: string) => void;
}

const ContractCard: React.FC<ContractCardProps> = ({ contract, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(contract.id);
    } catch (error) {
      console.error('Error deleting contract:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold">{contract.title}</h3>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="text-red-500 hover:text-red-700 disabled:opacity-50"
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
      <div className="space-y-2">
        <p className="text-sm text-gray-600">
          <span className="font-medium">Type:</span> {contract.contractType}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Status:</span> {contract.status}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Created:</span>{' '}
          {new Date(contract.createdAt).toLocaleDateString()}
        </p>
        {contract.analysis && (
          <div className="mt-4">
            <h4 className="font-medium mb-2">Analysis Summary:</h4>
            <p className="text-sm text-gray-700">{contract.analysis.summary}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContractCard; 