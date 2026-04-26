
'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Star, Send, X } from 'lucide-react';
import { toast } from 'sonner';

interface FeedbackFormProps {
  prototypeId: string;
  onClose: () => void;
}

const categories = [
  { id: 'engagement', label: 'Story Engagement', icon: '📖' },
  { id: 'usability', label: 'User Experience', icon: '🎮' },
  { id: 'innovation', label: 'Innovation', icon: '💡' },
  { id: 'accessibility', label: 'Accessibility', icon: '♿' }
];

export function FeedbackForm({ prototypeId, onClose }: FeedbackFormProps) {
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (Object.keys(ratings).length === 0) {
      toast.error('Please provide at least one rating');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prototypeId,
          feedbackType: 'PROTOTYPE_SPECIFIC',
          categories: ratings,
          comment: comment.trim() || undefined,
          rating: Math.round(Object.values(ratings).reduce((a, b) => a + b, 0) / Object.values(ratings).length)
        })
      });

      if (response.ok) {
        toast.success('Thank you for your feedback!');
        onClose();
      } else {
        toast.error('Failed to submit feedback');
      }
    } catch (error) {
      toast.error('Error submitting feedback');
    } finally {
      setIsSubmitting(false);
    }
  };

  const StarRating = ({ categoryId, currentRating }: { categoryId: string; currentRating: number }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => setRatings(prev => ({ ...prev, [categoryId]: star }))}
          className="hover:scale-110 transition-transform"
        >
          <Star 
            className={`w-5 h-5 ${
              star <= currentRating 
                ? 'fill-yellow-400 text-yellow-400' 
                : 'text-gray-300 hover:text-yellow-300'
            }`} 
          />
        </button>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <CardTitle>Prototype Feedback</CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-4">
        {categories.map((category) => (
          <div key={category.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-lg">{category.icon}</span>
              <span className="font-medium">{category.label}</span>
            </div>
            <StarRating 
              categoryId={category.id} 
              currentRating={ratings[category.id] || 0} 
            />
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Additional Comments</label>
        <Textarea
          placeholder="What did you think of this prototype? Any suggestions or observations?"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
        />
      </div>

      <Button 
        onClick={handleSubmit}
        disabled={isSubmitting || Object.keys(ratings).length === 0}
        className="w-full"
      >
        {isSubmitting ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
            Submitting...
          </>
        ) : (
          <>
            <Send className="w-4 h-4 mr-2" />
            Submit Feedback
          </>
        )}
      </Button>
    </div>
  );
}
