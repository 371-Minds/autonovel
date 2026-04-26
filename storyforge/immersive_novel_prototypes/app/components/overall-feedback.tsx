
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Star, Send, MessageSquare, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

const feedbackCategories = [
  { id: 'innovation', label: 'Innovation', icon: '🚀' },
  { id: 'usability', label: 'User Experience', icon: '👤' },
  { id: 'engagement', label: 'Engagement', icon: '🎯' },
  { id: 'accessibility', label: 'Accessibility', icon: '♿' },
  { id: 'technical', label: 'Technical Quality', icon: '⚡' },
  { id: 'storytelling', label: 'Storytelling', icon: '📚' }
];

export function OverallFeedback() {
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRating = (categoryId: string, rating: number) => {
    setRatings(prev => ({
      ...prev,
      [categoryId]: rating
    }));
  };

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
          feedbackType: 'OVERALL_EXPERIENCE',
          categories: ratings,
          comment: comment.trim() || undefined,
          rating: Math.round(Object.values(ratings).reduce((a, b) => a + b, 0) / Object.values(ratings).length)
        })
      });

      if (response.ok) {
        toast.success('Thank you for your feedback!');
        setRatings({});
        setComment('');
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
          onClick={() => handleRating(categoryId, star)}
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

  const averageRating = Object.values(ratings).length > 0 
    ? Object.values(ratings).reduce((a, b) => a + b, 0) / Object.values(ratings).length 
    : 0;

  return (
    <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-purple-900">
          <div className="p-2 rounded-lg bg-purple-500">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          Overall Experience Feedback
        </CardTitle>
        <p className="text-purple-700">Help us improve the future of interactive storytelling</p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Rating Categories */}
        <div className="space-y-4">
          <h3 className="font-medium text-purple-900">Rate Your Experience</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {feedbackCategories.map((category) => (
              <div key={category.id} className="flex items-center justify-between p-3 bg-white/60 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{category.icon}</span>
                  <span className="text-sm font-medium text-purple-800">{category.label}</span>
                </div>
                <StarRating 
                  categoryId={category.id} 
                  currentRating={ratings[category.id] || 0} 
                />
              </div>
            ))}
          </div>
        </div>

        {/* Overall Rating Display */}
        {averageRating > 0 && (
          <div className="flex items-center gap-4 p-4 bg-white/80 rounded-lg border border-purple-200">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <span className="font-medium text-purple-900">Overall Rating:</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    className={`w-4 h-4 ${
                      star <= Math.round(averageRating) 
                        ? 'fill-yellow-400 text-yellow-400' 
                        : 'text-gray-300'
                    }`} 
                  />
                ))}
              </div>
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                {averageRating.toFixed(1)} / 5.0
              </Badge>
            </div>
          </div>
        )}

        {/* Comment Section */}
        <div className="space-y-3">
          <h3 className="font-medium text-purple-900">Additional Comments</h3>
          <Textarea
            placeholder="Share your thoughts about the prototype suite, suggestions for improvement, or any specific features you'd like to see..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="min-h-[100px] bg-white/80 border-purple-200 focus:border-purple-400"
          />
        </div>

        {/* Submit Button */}
        <Button 
          onClick={handleSubmit}
          disabled={isSubmitting || Object.keys(ratings).length === 0}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
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

        {/* Instructions */}
        <p className="text-xs text-purple-600 text-center">
          Your feedback helps us understand which storytelling approaches resonate most with readers 
          and guides the development of full-scale interactive novels.
        </p>
      </CardContent>
    </Card>
  );
}
