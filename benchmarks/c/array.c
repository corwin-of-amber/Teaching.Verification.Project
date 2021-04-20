void assert(int condition);
void ensures(int postcondition);
extern int ret;

#define N 100
#define SWAP(X,Y) { tmp = (X); (X) = (Y); (Y) = tmp; }

/**
 * Computes the maximal of three array elements.
 */
int max3_array(int arr[N], int i, int j, int k) {
    /**/ ensures(((ret == arr[i]) || (ret == arr[j]) || (ret == arr[k]))
                 && (ret <= arr[i]) && (ret <= arr[j]) && (ret <= arr[k])); /**/

    if (arr[i] > arr[j]) {
        if (arr[i] > arr[k]) return arr[i];
    }
    else {
        if (arr[j] > arr[k]) return arr[j];
    }
    return arr[k];
}

/**
 * Same, but indices are also given as an array.
 */
int max3_array_indirect(int arr[N], int is[3]) {
    /**/ ensures(((ret == arr[is[0]]) || (ret == arr[is[1]]) || (ret == arr[is[2]]))
                  && (ret <= arr[is[0]]) && (ret <= arr[is[1]]) && (ret <= arr[is[2]])); /**/

    if (arr[is[0]] > arr[is[1]]) {
        if (arr[is[0]] > arr[is[2]]) return arr[is[0]];
    }
    else {
        if (arr[is[1]] > arr[is[2]]) return arr[is[1]];
    }
    return arr[is[2]];
}


void sort3(int arr[N], int i) {
    int tmp;

    if (arr[i] > arr[i + 1]) SWAP(arr[i], arr[i + 1]);
    if (arr[i + 1] > arr[i + 2]) SWAP(arr[i + 1], arr[i + 2]);
    if (arr[i] > arr[i + 1]) SWAP(arr[i], arr[i + 1]);

    /**/ assert((arr[i] <= arr[i + 1]) && (arr[i + 1] <= arr[i + 2])); /**/
}
