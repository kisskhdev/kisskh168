// កូដសម្រាប់ Cloudflare Worker
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // ចាប់យកតម្លៃ v ពី Link (ដែលយើងបាន encode btoa)
    const encodedUrl = url.searchParams.get('v');

    if (!encodedUrl) {
      return new Response('Missing Video URL', { status: 400 });
    }

    try {
      // Decode មកជា Link ដើមវិញ
      const targetUrl = atob(encodedUrl);

      // ទាញយកវីដេអូពី Source ដើម
      const response = await fetch(targetUrl, {
        headers: {
          // ក្លែងបន្លំថាជា Browser ដើម្បីកុំឱ្យគេ Block
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          // ដាក់ Referer បើសិនជា Source ដើមទាមទារ
          'Referer': 'https://vod.sooplive.co.kr/' 
        }
      });

      // បង្កើត Response ថ្មីដែលអនុញ្ញាត CORS
      const newResponse = new Response(response.body, response);
      newResponse.headers.set('Access-Control-Allow-Origin', '*');
      newResponse.headers.set('Content-Type', response.headers.get('Content-Type'));

      return newResponse;

    } catch (e) {
      return new Response('Error: ' + e.message, { status: 500 });
    }
  },
};