import { useCallback, useEffect, useState } from 'react';
import {
  useCollectionOnce
} from 'react-firebase-hooks/firestore';

const useFirestoreLoadMore = (queryFn, messageRef) => {
  const [query, setQuery] = useState(null);
  const [last, setLast] = useState(null);
  const [data, setData] = useState([]);

  const [qData, loading, error] = useCollectionOnce(query);

  useEffect(() => {
    setData([]);
    setQuery(queryFn());
  }, [queryFn]);

  useEffect(() => {
    if (qData && qData) {
      setLast(qData.docs[qData.docs.length - 1]);
      setData([...data, ...qData.docs]);
    }
  }, [qData]);
  // console.log({
  //   mdxx,
  //   data: data.map((doc) => ({
  //     ...doc.data(),
  //     id: doc.id,
  //   })),
  // });

  const more = useCallback(() => {
    setQuery(queryFn().startAfter(last));
  }, [queryFn, setQuery, last]);

  return [[data, loading, error], more];
};

export default useFirestoreLoadMore;
