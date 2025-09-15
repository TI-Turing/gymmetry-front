// __tests__/utils/rateLimitUtils.test.ts
import {
  rateLimiter,
  canCreatePost,
  canCreateComment,
  canToggleLike,
  getRateLimitMessage,
} from '../../utils/rateLimitUtils';

describe('Rate Limit Utils', () => {
  beforeEach(() => {
    // Clear rate limiter state before each test
    rateLimiter.clear();
  });

  describe('canCreatePost', () => {
    it('should allow post creation initially', () => {
      expect(canCreatePost('user1')).toBe(true);
    });

    it('should enforce rate limit for posts', () => {
      const userId = 'user1';

      // Should allow first few posts
      expect(canCreatePost(userId)).toBe(true);
      expect(canCreatePost(userId)).toBe(true);
      expect(canCreatePost(userId)).toBe(true);

      // Depending on rate limit configuration, should eventually block
      // This test assumes a reasonable rate limit is in place
      let blocked = false;
      for (let i = 0; i < 20; i++) {
        if (!canCreatePost(userId)) {
          blocked = true;
          break;
        }
      }
      expect(blocked).toBe(true);
    });

    it('should track different users separately', () => {
      expect(canCreatePost('user1')).toBe(true);
      expect(canCreatePost('user2')).toBe(true);
      expect(canCreatePost('user1')).toBe(true);
      expect(canCreatePost('user2')).toBe(true);
    });
  });

  describe('canCreateComment', () => {
    it('should allow comment creation initially', () => {
      expect(canCreateComment('user1')).toBe(true);
    });

    it('should enforce rate limit for comments', () => {
      const userId = 'user1';

      // Comments typically have higher limits than posts
      let allowedCount = 0;
      for (let i = 0; i < 50; i++) {
        if (canCreateComment(userId)) {
          allowedCount++;
        } else {
          break;
        }
      }

      // Should allow some comments but eventually rate limit
      expect(allowedCount).toBeGreaterThan(5);
      expect(allowedCount).toBeLessThan(50);
    });

    it('should work independently from post limits', () => {
      const userId = 'user1';

      // Exhaust post limit
      for (let i = 0; i < 20; i++) {
        canCreatePost(userId);
      }

      // Should still allow comments
      expect(canCreateComment(userId)).toBe(true);
    });
  });

  describe('canToggleLike', () => {
    it('should allow like toggling initially', () => {
      expect(canToggleLike('user1')).toBe(true);
    });

    it('should enforce rate limit for likes', () => {
      const userId = 'user1';

      // Likes typically have the highest limits
      let allowedCount = 0;
      for (let i = 0; i < 200; i++) {
        if (canToggleLike(userId)) {
          allowedCount++;
        } else {
          break;
        }
      }

      // Should allow many likes but eventually rate limit
      expect(allowedCount).toBeGreaterThan(10);
      expect(allowedCount).toBeLessThan(200);
    });
  });

  describe('getRateLimitMessage', () => {
    it('should return appropriate message for posts', () => {
      const message = getRateLimitMessage('post');
      expect(message).toContain('post');
      expect(typeof message).toBe('string');
      expect(message.length).toBeGreaterThan(0);
    });

    it('should return appropriate message for comments', () => {
      const message = getRateLimitMessage('comment');
      expect(message).toContain('comentario');
      expect(typeof message).toBe('string');
      expect(message.length).toBeGreaterThan(0);
    });

    it('should return appropriate message for likes', () => {
      const message = getRateLimitMessage('like');
      expect(message).toContain('like');
      expect(typeof message).toBe('string');
      expect(message.length).toBeGreaterThan(0);
    });

    it('should return default message for unknown action', () => {
      const message = getRateLimitMessage('unknown' as never);
      expect(typeof message).toBe('string');
      expect(message.length).toBeGreaterThan(0);
    });
  });

  describe('rateLimiter', () => {
    it('should be accessible for advanced usage', () => {
      expect(rateLimiter).toBeDefined();
      expect(typeof rateLimiter.clear).toBe('function');
    });

    it('should clear all limits when cleared', () => {
      const userId = 'user1';

      // Create some activity
      canCreatePost(userId);
      canCreateComment(userId);
      canToggleLike(userId);

      // Clear and verify reset
      rateLimiter.clear();

      // Should allow actions again
      expect(canCreatePost(userId)).toBe(true);
      expect(canCreateComment(userId)).toBe(true);
      expect(canToggleLike(userId)).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should handle empty user IDs', () => {
      expect(canCreatePost('')).toBe(true);
      expect(canCreateComment('')).toBe(true);
      expect(canToggleLike('')).toBe(true);
    });

    it('should handle special characters in user IDs', () => {
      const specialUserId = 'user@123.com';
      expect(canCreatePost(specialUserId)).toBe(true);
      expect(canCreateComment(specialUserId)).toBe(true);
      expect(canToggleLike(specialUserId)).toBe(true);
    });

    it('should handle rapid successive calls', () => {
      const userId = 'user1';
      const results = [];

      // Make many rapid calls
      for (let i = 0; i < 10; i++) {
        results.push(canCreatePost(userId));
      }

      // Should have consistent behavior
      expect(results).toContain(true);
      expect(Array.isArray(results)).toBe(true);
    });
  });
});
