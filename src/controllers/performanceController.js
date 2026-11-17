const supabase = require('../lib/supabase');

// [과제 1] 공연 목록 조회
async function getPerformances(req, res, next) {
  try {
    const { data, error } = await supabase
      // TODO 1-1. performances 테이블에서 모든 데이터 조회
      .from('performances')
      // TODO 1-2. id 기준 오름차순 정렬
      .select('*')
      // TODO 1-3. 조회 결과를 JSON으로 응답
      .order('id', { ascending : true });

    if (error) throw error;

    return res.status(200).json(data);
  } catch (error) {
    next(error);
  }
}

// [과제 2] 공연 등록
async function createPerformance(req, res, next) {
  try {
    // TODO 2-1. 요청 Body에서 공연 정보 가져오기
    const { title, venue, starts_at, price } = req.body;
    // TODO 2-2. 필수값 확인
    if (!title || !venue || !starts_at || price === undefined || price === null) {
      return res.status(400).json({
        error : "모든 공연 정보를 입력해 주세요.",
      })
    }

    const numericPrice = Number(price);

    if (!Number.isInterger(numericPrice) || numericPrice < 0) {
      return res.status(400).json({
        error : `가격은 0 이상의 정수여야 합니다.`,
      });
    }

    // TODO 2-3. Supabase에 데이터 등록
    const { data, error } = await supabase 
      .from(`performance`)
      .insert({ title, venue, starts_at, price: numericPrice })
      .select()
      .single();

    if (error) throw error;
    // TODO 2-4. 등록 결과 반환
    return res.status(201).json(data);
  } catch (error) {
    next(error);
  }
}

// [과제 3] 공연 수정
async function updatePerformance(req, res, next) {
  try {
    // TODO 3-1. 요청 URL에서 id 가져오기
    const { id } = req.params;
    // TODO 3-2. 수정할 공연 정보 가져오기
    const { title, venue, starts_at, price } = req.body;

    const updates = {};

    if (title !== undefined) updates.title = title;
    if (venue !== undefined) updates.venue = venue;
    if (starts_at !== undefined) updates.starts_at = starts_at;

    if(price !== undefined) {
      const numericPrice = Number(price);

    // TODO 3-3. 입력값 검증
    if (!Number.isInteger(numericPrice) || numericPrice < 0) {
      return res.status(400).json({
        error : `수정할 공연 제목을 입력해주세요.`,
      });
    }

    updates.price = numericPrice;
  }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        error : `수정할 정보를 입력해 주세요.`,
      });
    }

    // TODO 3-4. Supabase 데이터 수정
    const { data, error } = await supabase
      .from(`performance`)
      .update({ title })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({
        error : `해당 공연을 찾을 수 없습니다.`,
      });
    }
    // TODO 3-5. 수정 결과 반환

    return res.status(200).json(data);
  } catch (error) {
    next(error);
  }
}

// [과제 4] 공연 삭제
async function deletePerformance(req, res, next) {
  try {
    // TODO 4-1. 요청 URL에서 id 가져오기
    const { id } = req.params;
    // TODO 4-2. Supabase 데이터 삭제
    const { data, error } = await supabase
      .from(`performance`)
      .delete()
      .eq(`id`, id)
      .select()
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({
        error : `해당 공연을 찾을 수 없습니다.`,
      });
    }
    // TODO 4-3. 삭제 결과 반환
    return res.status(200).json({
      message : `공연이 삭제되었습니다.`,
      data,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getPerformances,
  createPerformance,
  updatePerformance,
  deletePerformance,
};