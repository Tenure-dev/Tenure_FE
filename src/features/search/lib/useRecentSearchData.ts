import { useCallback, useEffect, useState } from 'react';
import {
  deleteAllRecentKeywords,
  deleteAllRecentUsers,
  deleteRecentKeyword,
  deleteRecentUser,
  getSearchRecent,
} from '../api/searchApi';
import type { RecentSearchItem, RecentViewedUser } from '../model/types';

export const useRecentSearchData = () => {
  const [recentViewedUsers, setRecentViewedUsers] = useState<RecentViewedUser[]>([]);
  const [recentSearches, setRecentSearches] = useState<RecentSearchItem[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // 검색을 실행하면 BE가 최근 검색어에 비동기로 기록하므로(별도 콜백 없음),
  // 마운트 시 한 번만 불러오면 방금 검색한 키워드가 다음 검색에도 안 보인다.
  // 검색창을 다시 열 때마다(refresh) 서버에서 새로 받아와야 반영된다.
  const refresh = useCallback(() => {
    getSearchRecent().then((data) => {
      setRecentViewedUsers(
        data.recentUsers.map((u) => ({
          id: u.userId,
          name: u.username,
          avatarUrl: u.profileImageUrl,
        })),
      );
      setRecentSearches(data.recentKeywords.map((k) => ({ id: k.id, keyword: k.keyword })));
      setSuggestions(data.suggestions);
    });
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const removeRecentUser = (id: number) => {
    setRecentViewedUsers((prev) => prev.filter((u) => u.id !== id));
    deleteRecentUser(id);
  };

  const clearAllRecentUsers = () => {
    setRecentViewedUsers([]);
    deleteAllRecentUsers();
  };

  const removeRecentKeyword = (id: number) => {
    setRecentSearches((prev) => prev.filter((s) => s.id !== id));
    deleteRecentKeyword(id);
  };

  const clearAllRecentKeywords = () => {
    setRecentSearches([]);
    deleteAllRecentKeywords();
  };

  // 검색을 실행한 키워드는 최근 검색어 목록에서 화면상 즉시 걷어낸다(BE가 다시 최상단에 기록함).
  const consumeKeyword = (trimmedKeyword: string) => {
    setRecentSearches((prev) => prev.filter((item) => item.keyword !== trimmedKeyword));
  };

  return {
    recentViewedUsers,
    recentSearches,
    suggestions,
    refresh,
    removeRecentUser,
    clearAllRecentUsers,
    removeRecentKeyword,
    clearAllRecentKeywords,
    consumeKeyword,
  };
};
