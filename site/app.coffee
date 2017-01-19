# Transforming geodata from physical coordinates to earth centered earth fixed(ECEF)
# then to orthographic in 2D
deg2rad = Math.PI / 180
ll2ecef = (lat, lon, h=0) ->
  [lat, lon] = [lat * deg2rad, lon  * deg2rad]
  [clat, clon] = [Math.cos(lat), Math.cos(lon)]
  [slat, slon] = [Math.sin(lat), Math.sin(lon)]
  [a, f] = [6378137, 298.257223563 ** -1]
  C = (clat ** 2 + ((1 - f) * slat) ** 2) ** -0.5
  S = (1 - f) ** 2 * C
  H = h / a
  x = (C + H) * clat * clon
  y = (C + H) * clat * slon
  z = (S + H) * slat
  return [x, y, z]

get_ecef2ortho = (lat, lon, zoom, w, h) ->
  [dx, dy] = [lat * deg2rad, lon * deg2rad]
  [sx, cx] = [Math.sin(dx), Math.cos(dx)]
  [sy, cy] = [Math.sin(dy), Math.cos(dy)]
  [w2, h2] = [w / 2, h / 2]
  wh = Math.min(w2, h2) * zoom
  [a, b, d, e, f] = [-sy * wh, cy * wh, cy * sx * wh, sx * sy * wh, -cx * wh]
  return (x, y, z) -> [w2 + x * a + y * b, h2 + x * d + y * e + z * f]

# Move Hawaii and Alaska closer to Mainland, also shrink Alaska
indexes = []
for poly in geodata.locations['HI'].paths
  for i in poly
    if i not in indexes
      indexes.push(i)
for i in indexes
  [lat, lon] = geodata.points[i]
  geodata.points[i] = [lat+5, lon+50]

indexes = []
for poly in geodata.locations['AK'].paths
  for i in poly
    if i not in indexes
      indexes.push(i)
[minX, minY, maxX, maxY] = [Number.MAX_VALUE, Number.MAX_VALUE, Number.MIN_VALUE, Number.MIN_VALUE]
for i in indexes
  [lat, lon] = geodata.points[i]
  if lon < 0
    [minX, minY, maxX, maxY] = [Math.min(minX,lon), Math.min(minY,lat), Math.max(maxX,lon), Math.max(maxY,lat)]
[centerX, centerY] = [(minX+maxX)/2, (minY+maxY)/2]
for i in indexes
  [lat, lon] = geodata.points[i]
  if lon > 0
    lon = lon - 360
  dlon = Math.abs(lon-centerX)*12/17
  dlat = Math.abs(lat-centerY)*9/17
  if lat > centerY
    lat = lat-dlat
  else
    lat = lat+dlat
  if lon > centerX
    lon = lon-dlon
  else
    lon = lon+dlon
  if lon < -180
    lon = lon+360
  geodata.points[i] = [lat-35, lon-10]


for i in [0...geodata.points.length]
  [lat, lon] = geodata.points[i]
  geodata.points[i] = ll2ecef(lat, lon)
  if lon >= 0
    lon -= 360
  if i == 0
    [x1, x2, y1, y2] = [lon, lon, lat, lat]
  [y1, y2] = [Math.min(y1, lat), Math.max(y2, lat)]
  [x1, x2] = [Math.min(x1, lon), Math.max(x2, lon)]
[LON_MIN, LON_MAX, LAT_MIN, LAT_MAX] = [x1, x2, y1, y2]

# Constants
WEEKDAYS = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
]
MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
]
NATIONAL = [
  'nat'
]
HHS_REGIONS = [
  'hhs1', 'hhs2', 'hhs3', 'hhs4', 'hhs5', 'hhs6', 'hhs7', 'hhs8', 'hhs9', 'hhs10'
]
CENSUS_REGIONS = [
  'cen1', 'cen2', 'cen3', 'cen4', 'cen5', 'cen6', 'cen7', 'cen8', 'cen9'
]
REGIONS = HHS_REGIONS.concat(CENSUS_REGIONS)
STATES = [
  'AK', 'AL', 'AR', 'AZ', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL', 'GA', 'HI', 'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA', 'MA', 'MD', 'ME', 'MI', 'MN', 'MO', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH', 'NJ', 'NM', 'NV', 'NY', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VA', 'VT', 'WA', 'WI', 'WV', 'WY'
]
LOCATIONS = NATIONAL.concat(REGIONS).concat(STATES)

ILI_SHARED = [
  # select state, count(1) from fluview_state group by state order by state
  'AK', 'AZ', 'CA', 'CO', 'ID', 'KS', 'LA', 'MD', 'ME', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH', 'OH', 'OR', 'PA', 'RI', 'TN', 'TX', 'VA', 'VI', 'VT', 'WI', 'WV', 'WY'
]
ILI_AVAILABLE = [
  # select state, count(1) from state_ili group by state order by state
  'AK', 'AL', 'AR', 'AZ', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'IA', 'ID', 'IL', 'IN', 'KS', 'LA', 'MA', 'MD', 'ME', 'MI', 'MN', 'MO', 'MS', 'MT', 'NC', 'NE', 'NH', 'NJ', 'NM', 'NV', 'NY', 'OH', 'OK', 'OR', 'RI', 'SC', 'SD', 'TN', 'TX', 'VT', 'WI', 'WV', 'WY'
]
NAMES = {"FL": "Florida", "cen4": "West North Central", "hhs9": "HHS Region 9", "MT": "Montana", "WV": "West Virginia", "RI": "Rhode Island", "AR": "Arkansas", "VA": "Virginia", "cen7": "West South Central", "IN": "Indiana", "NC": "North Carolina", "IA": "Iowa", "MN": "Minnesota", "cen2": "Middle Atlantic", "DE": "Delaware", "PA": "Pennsylvania", "hhs7": "HHS Region 7", "nat": "US National", "hhs10": "HHS Region 10", "LA": "Louisiana", "MD": "Maryland", "AK": "Alaska", "CO": "Colorado", "WI": "Wisconsin", "ID": "Idaho", "OK": "Oklahoma", "hhs3": "HHS Region 3", "hhs2": "HHS Region 2", "hhs1": "HHS Region 1", "cen1": "New England", "KY": "Kentucky", "ME": "Maine", "CA": "California", "cen5": "South Atlantic", "WY": "Wyoming", "ND": "North Dakota", "NY": "New York", "MA": "Massachusetts", "UT": "Utah", "DC": "District of Columbia", "MS": "Mississippi", "hhs6": "HHS Region 6", "GA": "Georgia", "AL": "Alabama", "HI": "Hawaii", "hhs4": "HHS Region 4", "AZ": "Arizona", "CT": "Connecticut", "KS": "Kansas", "NH": "New Hampshire", "cen8": "Mountain", "TX": "Texas", "NV": "Nevada", "TN": "Tennessee", "NJ": "New Jersey", "MI": "Michigan", "hhs8": "HHS Region 8", "NM": "New Mexico", "IL": "Illinois", "cen3": "East North Central", "VT": "Vermont", "WA": "Washington", "SD": "South Dakota", "NE": "Nebraska", "hhs5": "HHS Region 5", "SC": "South Carolina", "cen6": "East South Central", "OR": "Oregon", "cen9": "Pacific", "MO": "Missouri", "OH": "Ohio"}
REGION2STATE = {"hhs1": ['ME', 'MA', 'NH', 'VT', 'RI', 'CT'], "hhs2": ['NY', 'NJ'], "hhs3": ['PA', 'DE', 'DC', 'MD', 'VA', 'WV'], "hhs4": ['NC', 'SC', 'GA', 'FL', 'KY', 'TN', 'MS', 'AL'], "hhs5": ['MI', 'IL', 'IN', 'OH', 'WI', 'MN'], "hhs6": ['LA', 'AR', 'OK', 'TX', 'NM'], "hhs7": ['IA', 'MO', 'NE', 'KS'], "hhs8": ['ND', 'SD', 'CO', 'WY', 'MT', 'UT'], "hhs9": ['NV', 'CA', 'HI', 'AZ'], "hhs10": ['WA', 'OR', 'AK', 'ID'], "cen1": ['ME', 'MA', 'NH', 'VT', 'RI', 'CT'], "cen2": ['PA', 'NY', 'NJ'], "cen3": ['WI', 'MI', 'IN', 'IL', 'OH'], "cen4": ['ND', 'SD', 'NE', 'KS', 'MN', 'IA', 'MO'], "cen5": ['DE','MD','DC','WV','VA','NC','SC','GA','FL'], "cen6": ['KY','TN', 'MS', 'AL'], "cen7": ['OK', 'AR', 'LA', 'TX'], "cen8": ['MT', 'ID', 'WY', 'CO', 'UT', 'NV', 'AZ', 'NM'], "cen9": ['WA', 'OR', 'CA', 'AK', 'HI']}

POPULATION = {
  'AK':   731449, 'AL':  4822023, 'AR':  2949131, 'AZ':  6553255,
  'CA': 38041430, 'CO':  5187582, 'CT':  3590347, 'DC':   632323,
  'DE':   917092, 'FL': 19317568, 'GA':  9919945, 'HI':  1392313,
  'IA':  3074186, 'ID':  1595728, 'IL': 12875255, 'IN':  6537334,
  'KS':  2885905, 'KY':  4380415, 'LA':  4601893, 'MA':  6646144,
  'MD':  5884563, 'ME':  1329192, 'MI':  9883360, 'MN':  5379139,
  'MO':  6021988, 'MS':  2984926, 'MT':  1005141, 'NC':  9752073,
  'ND':   699628, 'NE':  1855525, 'NH':  1320718, 'NJ':  8864590,
  'NM':  2085538, 'NV':  2758931, 'NY': 19570261, 'OH': 11544225,
  'OK':  3814820, 'OR':  3899353, 'PA': 12763536, 'RI':  1050292,
  'SC':  4723723, 'SD':   833354, 'TN':  6456243, 'TX': 26059203,
  'UT':  2855287, 'VA':  8185867, 'VT':   626011, 'WA':  6897012,
  'WI':  5726398, 'WV':  1855413, 'WY':   576412,
}

# Non-Influennza Week Calculation
NON_INFLUENZA_WEEK_SEASON = 2015

calculateMean = (values) ->
  sum = 0
  for v in values
    sum += v
  return sum/values.length

calculateStdev = (values, mean) ->
  sum = 0
  for v in values
    sum += (v - mean)**2
  return (sum/(values.length-1))**0.5

calculateNonInfluenzaData = (epidata) ->
  NonInfluenzaData = {}
  mappedData = {}
  for loc in LOCATIONS
    mappedData[loc] = {}
  for row in epidata
    wk = row.epiweek%100
    mappedData[row.location][wk] = row.value
  for region in HHS_REGIONS
    weeks = nonInfluenzaWeekData[region]
    for state in REGION2STATE[region]
      values = []
      for week in weeks
        values.push(mappedData[state][week])
      mean = calculateMean(values)
      stdev = calculateStdev(values, mean)
      NonInfluenzaData[state] = [mean, stdev]
  return NonInfluenzaData
  
calculateColor = (NonInfluenzaData, epidata, ep) ->
  mappedData = {}
  levelData = {}
  colorData = {}
  for row in epidata
    if row.epiweek = ep
      mappedData[row.location] = row.value
  for state in STATES
    [mean, stdev] = NonInfluenzaData[state]
    ili = mappedData[state]
    level = activity_level(ili, mean, stdev)
    colorData[state] = level2Color(level)
    levelData[state] = level
  for region in REGIONS
    pop_total = 0
    for state in REGION2STATE[region]
      pop_total += POPULATION[state]
    level = 0
    for state in REGION2STATE[region]
      level += (POPULATION[state]/pop_total) * levelData[state]
    colorData[region] = level2Color(level)
    levelData[region] = level
  pop_total = 0
  for state in STATES
    pop_total += POPULATION[state]
  level = 0
  for state in STATES
    level += (POPULATION[state]/pop_total) * levelData[state]
  colorData['nat'] = level2Color(level)
  levelData['nat'] = level
  return colorData

activity_level = (ili, mean, stdev) ->
  l = (ili-mean)/stdev
  if l < 1.1
    return 1
  if l < 2.5
    return 2
  if l < 4.0
    return 3
  if l < 4.9
    return 4
  if l < 6.0
    return 5
  if l < 7.6
    return 6
  if l < 8.0
    return 7
  if l < 9.5
    return 8
  if l < 12
    return 9
  return 10

level2Color = (level) ->
  return Math.max(0, Math.min(10, level)) / 10

Date.prototype.getWeek = () ->
  stdDate = new Date(2016, 0, 3)
  rst = (Math.ceil((((this - stdDate) / 86400000) + stdDate.getDay() + 1) / 7)%52)
  if rst == 0
    return 52
  return rst

date2String = (date) ->
  return MONTHS[date.getMonth()]+" "+date.getDate()+", "+date.getFullYear()

epiweek2date = (epiweek) ->
  stdDate = new Date(2016, 0, 3)
  wk = epiweek%100
  yr = (Math.round(epiweek / 100))
  increment = ((yr - 2016) * 52 + wk - 1) * 7
  stdDate.setDate(stdDate.getDate() + increment);
  return stdDate


getFakeRow = (location, i) ->
  'location': location
  'epiweek': 201201 + 100 * Math.floor(i / 52) + i % 52
  'value': 1 + Math.random() * 3
  'std': 0.5 + Math.random() * 1
  'wili': 1 + Math.random() * 3

getEpidataHander = (callback) ->
  return (result, message, epidata) ->
    if result == 1
      callback(epidata)
    else
      msg = "The Epidata API says '#{message}'. (error ##{result})"
      console.log(msg)
      alert(msg)

Epidata_fluview_single = (handler, location, epiweeks) ->
  if Epidata?.fluview?
    Epidata.fluview(handler, location, epiweeks)
  else
    fakeData = (getFakeRow(location, i) for i in [0...280])
    callback = () -> handler(1, 'debug', fakeData)
    delay = 250 + Math.round(Math.random() * 500)
    window.setTimeout(callback, delay)

Epidata_nowcast_single = (handler, location) ->
  if Epidata?.nowcast?
    Epidata.nowcast(handler, location, '201130-202030')
  else
    fakeData = (getFakeRow(location, i) for i in [0...280])
    callback = () -> handler(1, 'debug', fakeData)
    delay = 250 + Math.round(Math.random() * 500)
    window.setTimeout(callback, delay)

Epidata_nowcast_multi = (handler, locations, epiweek1, epiweek2) ->
  if Epidata?.nowcast?
    Epidata.nowcast(handler, locations, Epidata.range(epiweek1, epiweek2))
  else
    fakeData = []
    for location in locations
      for i in [0...280]
        fakeData.push(getFakeRow(location, i))
    callback = () -> handler(1, 'debug', fakeData)
    delay = 250 + Math.round(Math.random() * 500)
    window.setTimeout(callback, delay)


class PointerInput

  THRESHOLD = 5

  constructor: (@elem, @listener) ->
    @elem.on('mousedown touchstart', (e) => @onDown(e))
    @elem.on('mouseup touchend', (e) => @onUp(e))
    @elem.on('mousemove touchmove', (e) => @onMove(e))
    @elem.on('mouseleave touchleave', (e) => @onLeave(e))
    @elem.on('wheel', (e) => @onWheel(e))

  _get_xyt: (e) ->
    if e.touches?.length > 0
      touch = e.touches.item(0)
      offset = @elem.offset()
      return [touch.pageX - offset.left, touch.pageY - offset.top, +new Date()]
    else
      return [e.offsetX, e.offsetY, +new Date()]

  onDown: (e) ->
    @last = @down = @_get_xyt(e)

  onUp: (e) ->
    if not @down? then return
    [x1, y1, t1] = @down
    [x2, y2, t2] = @_get_xyt(e)
    @down = null
    if ((x2 - x1) ** 2 + (y2 - y1) ** 2) ** 0.5 < THRESHOLD
      @listener.onClick((x1 + x2) / 2, (y1 + y2) / 2)

  onMove: (e) ->
    if not @down? then return
    e.preventDefault()
    @curr = @_get_xyt(e)
    [x1, y1, t1] = @last
    [x2, y2, t2] = @curr
    @last = @curr
    @listener.onDrag(x2, y2, x2 - x1, y2 - y1)

  onLeave: (e) ->
    @down = null

  onWheel: (e) ->
    @listener.onScroll(e.originalEvent.deltaY)


window.App = class App

  PAGE_MAP = 0
  PAGE_CHART = 1

  constructor: () ->
    clicker = (name, locations) =>
      return () =>
        $('.button_group0 i').removeClass('fa-dot-circle-o')
        $('.button_group0 i').addClass('fa-circle-o')
        $("#button_view_#{name} i").removeClass('fa-circle-o')
        $("#button_view_#{name} i").addClass('fa-dot-circle-o')
        @setLocations(locations)
    # TODO: Move the following into pointerinput
    [xs0,xs1,xe2,xe3,ys0,ys1,ye2,ye3] = [-1,-1,-1,-1,-1,-1,-1,-1]
    isPinching = false
    pinchZoom = () =>
      d1 = ((xs0-xs1)**2+(ys0-ys1)**2)**0.5
      d2 = ((xe2-xe3)**2+(ye2-ye3)**2)**0.5
      if d1 > d2
        @zoomOut()
      else
        @zoomIn()
    pinchend = (e) =>
      if isPinching
        if e.originalEvent.changedTouches.length == 2          
          xe2 = e.originalEvent.changedTouches[0].pageX
          xe3 = e.originalEvent.changedTouches[1].pageX
          ye2 = e.originalEvent.changedTouches[0].pageY
          ye3 = e.originalEvent.changedTouches[1].pageY
          isPinching = false
          pinchZoom()
        if e.originalEvent.changedTouches.length == 1          
          if xe2 < 0
            xe2 = e.originalEvent.changedTouches[0].pageX
            ye2 = e.originalEvent.changedTouches[0].pageY
          else
            xe3 = e.originalEvent.changedTouches[0].pageX
            ye3 = e.originalEvent.changedTouches[0].pageY
            isPinching = false
            pinchZoom()
    pinchstart = (e) =>
      if e.originalEvent.targetTouches.length == 2
        isPinching = true
        [xs0,xs1,xe2,xe3,ys0,ys1,ye2,ye3] = [-1,-1,-1,-1,-1,-1,-1,-1]
        xs0 = e.originalEvent.targetTouches[0].pageX
        xs1 = e.originalEvent.targetTouches[1].pageX
        ys0 = e.originalEvent.targetTouches[0].pageY
        ys1 = e.originalEvent.targetTouches[1].pageY 
    $('#button_view_nat').click(clicker('nat', NATIONAL))
    $('#button_view_hhs').click(clicker('hhs', HHS_REGIONS))
    $('#button_view_cen').click(clicker('cen', CENSUS_REGIONS))
    $('#button_view_sta').click(clicker('sta', STATES))
    $('#button_zoom_in').click(() => @zoomIn())
    $('#button_zoom_out').click(() => @zoomOut())
    @dataTimeline = $("#dataTimeline")
    @canvasMap = $('#canvas_map')
    @canvasMap.mousemove((e) => 
      loc = @hitTest(e.offsetX, e.offsetY)
      if loc?
        $('#canvas_map').css('cursor','pointer')
        @renderMap()
        ctx = @canvasMap[0].getContext('2d')
        ctx.font = 12 + 'px sans-serif'
        ctx.fillStyle = '#eee'
        current = @mapData[loc]
        ili = '' + (Math.round(current.value * 100) / 100)
        if '.' in ili
          ili += '00'
          idx = ili.indexOf('.')
          ili = ili.slice(0, idx + 3)
        else
          ili += '.00'
        std = '' + (Math.round(current.std * 100) / 100)
        if '.' in std
          std += '00'
          idx = std.indexOf('.')
          std = std.slice(0, idx + 3)
        else
          std += '.00'
        ili = '(' + ili + '±' + std + ')%'
        ctx.fillText(loc+" "+ili+"", e.offsetX, e.offsetY)
      else
        $('#canvas_map').css('cursor','auto')
        @renderMap())
    @canvasMap.on('touchstart',pinchstart)
    @canvasMap.on('touchend',pinchend)
    @canvasChart = $('#canvas_chart')
    $(window).resize(() => @resizeCanvas())
    @pointerInput = new PointerInput(@canvasMap, @)
    @canvasMap.focus()
    @currentPage = PAGE_MAP
    @setLocations(STATES)
    @resetView()
    @resizeCanvas()
    @loadEpidata()
    window.onpopstate = (e) => @backToHome()
    $('#back_arrow').click((e) -> window.history.back())
    
  loadEpidata: () ->
    callback = (epidata) =>
      epiweek1 = epidata[epidata.length - 4].epiweek
      epiweek2 = epidata[epidata.length - 1].epiweek
      currentdate = new Date();
      ind = 'PM'
      if currentdate.getHours() < 12
        ind = 'AM'
      mins = currentdate.getMinutes()
      if mins < 10
        mins = "0" + mins
      date = epiweek2date(epiweek2)
      datestr = "(" + date2String(date)
      date.setDate(date.getDate() + 6)
      datestr = datestr + "-" + date2String(date) + ")"
      @dataTimeline.html("Nowcasting epi-week " + epiweek2%100 + " " + datestr)
      callback1 = (epidata) =>
        alert(epidata.length)
        NonInfluenzaData = calculateNonInfluenzaData(epidata)
        callback2 = (epidata) =>
          @colors = {}
          @mapData = {}
          colorData = calculateColor(NonInfluenzaData, epidata, epiweek2)
          for row in epidata
            if row.epiweek == epiweek2
              ili = row.value
              v = colorData[row.location]
              c = ('0' + Math.round(0x3f + v * 0xc0).toString(16)).slice(-2)
              @colors[row.location] = '#' + c + '4040'
              @mapData[row.location] = row
          @renderMap()
        handler = getEpidataHander(callback2)
        Epidata_nowcast_multi(handler, LOCATIONS, epiweek1, epiweek2)
      handler = getEpidataHander(callback1)
      Epidata_nowcast_multi(handler, STATES, NON_INFLUENZA_WEEK_SEASON*100+40, (NON_INFLUENZA_WEEK_SEASON+1)*100+20)
    handler = getEpidataHander(callback)
    Epidata_nowcast_single(handler, 'nat')

  backToHome: () ->
    @currentPage = PAGE_MAP
    $('.pages').animate({left: '0%'}, 125)

  showLocationDetails: (loc) ->
    @currentPage = PAGE_CHART
    history.pushState({}, '')
    $('#location_name').html(NAMES[loc])
    $('.achievement_holder').hide()
    $('.achievement_holder_top').hide()
    $('.ili_note').hide()
    if loc.toUpperCase() in STATES
      $('#state_note').show()
      $('#state_note_left').show()
      $('#location_google1').show()
      $('#location_twitter1').show()
      $('#location_wiki0').show()
      $('#location_cdc1').show()
      $('#location_epicast0').show()
      $('#location_arch0').show()
      $('#location_sar30').show()
      if loc.toUpperCase() in ILI_AVAILABLE
        $('#location_star1').show()
      else
        $('#location_star0').show()
      if loc.toUpperCase() in ILI_SHARED
        $('#location_heart1').show()
      else
        $('#location_heart0').show()
    if loc in HHS_REGIONS
      $('#hhs_note').show()
      $('#hhs_note_left').show()
      $('#location_google0').show()
      $('#location_twitter1').show()
      $('#location_wiki0').show()
      $('#location_cdc1').show()
      $('#location_epicast1').show()
      $('#location_arch1').show()
      $('#location_sar31').show()
    if loc in CENSUS_REGIONS
      $('#location_google0').show()
      $('#location_twitter1').show()
      $('#location_wiki0').show()
      $('#location_cdc1').show()
      $('#location_epicast0').show()
      $('#location_arch1').show()
      $('#location_sar31').show()
    if loc == 'nat'
      $('#location_google1').show()
      $('#location_twitter1').show()
      $('#location_wiki1').show()
      $('#location_cdc1').show()
      $('#location_epicast1').show()
      $('#location_arch1').show()
      $('#location_sar31').show()
    $('.location_right').css('display', 'none')
    $('#loading_icon').css('display', 'flex')
    $('.pages').animate({left: '-100%'}, 125)
    @fetchNowcast(loc)

  setLocations: (@locations) ->
    @renderMapList()
    @renderMap()

  resizeCanvas: () ->
    @canvasMap.attr('width', @canvasMap.width() + 'px')
    @canvasMap.attr('height', @canvasMap.height() + 'px')
    @canvasChart.attr('width', @canvasChart.width() + 'px')
    @canvasChart.attr('height', @canvasChart.height() + 'px')
    @renderMap()
    @renderChart()

  resetView: () ->
    @dlat = 35
    @dlon = -108.8
    @zoom = 2.5
    @renderMap()

  onClick: (x, y) ->
    loc = @hitTest(x, y)
    if loc?
      @showLocationDetails(loc)

  onDrag: (x, y, dx, dy) ->
    @dlon -= dx / (4 * @zoom)
    @dlat += dy / (4 * @zoom)
    @dlat = Math.max(Math.min(@dlat, LAT_MAX), LAT_MIN)
    @dlon = Math.max(Math.min(@dlon, LON_MAX), LON_MIN)
    @renderMap()

  onScroll: (delta) ->
    factor = 1 + Math.abs(delta) / 500
    if delta < 0
      @zoomIn(factor)
    else
      @zoomOut(factor)

  zoomIn: (factor=1.5) ->
    @zoom = Math.min(@zoom * factor, 500)
    @renderMap()

  zoomOut: (factor=1.5) ->
    @zoom = Math.max(@zoom / factor, 1.25)
    @renderMap()

  renderMapList: () ->
    $('#map_list ul').empty()
    saveThis = @
    for loc in @locations
      $('#map_list ul').append(
        $('<li>').attr('class','map_list_element').attr('id', 'map_list_element_'+loc).append(
          $('<a>').attr('id', 'map_list_element_text_'+loc).append(NAMES[loc])));
    for loc in @locations
      $('#map_list_element_'+loc).click(()->saveThis.showLocationDetails(loc))
      $('#map_list_element_'+loc).hover(
        ((ev) -> 
          loc = this.id.substring(17)
          current = saveThis.mapData[loc]
          ili = '' + (Math.round(current.value * 100) / 100)
          if '.' in ili
            ili += '00'
            idx = ili.indexOf('.')
            ili = ili.slice(0, idx + 3)
          else
            ili += '.00'
          std = '' + (Math.round(current.std * 100) / 100)
          if '.' in std
            std += '00'
            idx = std.indexOf('.')
            std = std.slice(0, idx + 3)
          else
            std += '.00'
          ili = '(' + ili + '±' + std + ')%'
          $('#map_list_element_text_'+loc).text(ili)
          saveThis.renderMap(loc))
        ((ev) -> 
          loc = this.id.substring(17)
          $('#map_list_element_text_'+loc).text(NAMES[loc])
          saveThis.renderMap()))

  renderMap: (highlight=null) ->
    [w, h] = [@canvasMap.width(), @canvasMap.height()]
    ctx = @canvasMap[0].getContext('2d')
    ctx.clearRect(0, 0, w, h)
    ctx.strokeStyle = '#000'
    ctx.lineWidth = 1
    line = {
      0: (x, y) -> ctx.moveTo(x, y),
      1: (x, y) -> ctx.lineTo(x, y),
    }
    @ecef2ortho = get_ecef2ortho(@dlat, @dlon, @zoom, w, h)
    for loc in @locations
      if loc != highlight
        for poly in geodata.locations[loc].paths
          ctx.beginPath()
          ln = 0
          for idx in poly
            line[ln](@ecef2ortho(geodata.points[idx]...)...)
            ln |= 1
          ctx.closePath()
          ctx.fillStyle = @colors?[loc] ? '#ccc'
          ctx.fill()
          ctx.stroke()
    # Highlight the hovered region(decompose states as well)
    if highlight?
      ctx.font = 12 + 'px sans-serif'
      ctx.strokeStyle = '#eee'
      if highlight of REGION2STATE
        ctx.lineWidth = 0.5
        for loc in REGION2STATE[highlight]
          for poly in geodata.locations[loc].paths
            ctx.beginPath()
            ln = 0
            for idx in poly
              line[ln](@ecef2ortho(geodata.points[idx]...)...)
              ln |= 1
            ctx.closePath()
            ctx.fillStyle = @colors?[loc] ? '#ccc'
            ctx.fill()
            ctx.stroke()
        ctx.lineWidth = 1.5
        for poly in geodata.locations[highlight].paths
          ctx.beginPath()
          ln = 0
          for idx in poly
            line[ln](@ecef2ortho(geodata.points[idx]...)...)
            ln |= 1
          ctx.closePath()
          ctx.stroke()
        for loc in REGION2STATE[highlight]
          ctx.fillStyle = '#eee'
          [cX, cY] = @locCenterOnMap(loc)
          ctx.fillText(loc, cX, cY)
      else
        ctx.lineWidth = 1.5
        for poly in geodata.locations[highlight].paths
          ctx.beginPath()
          ln = 0
          for idx in poly
            line[ln](@ecef2ortho(geodata.points[idx]...)...)
            ln |= 1
          ctx.closePath()
          ctx.fillStyle = @colors?[loc] ? '#ccc'
          ctx.fill()
          ctx.stroke()
        ctx.fillStyle = '#eee'
        [cX, cY] = @locCenterOnMap(highlight)
        ctx.fillText(highlight, cX, cY)
    # Draw AK and HI seperately
    if highlight != 'AK'
      [cX, cY] = @locCenterOnMap('AK')
      ctx.font = 12 + 'px sans-serif'
      ctx.fillStyle = '#eee'
      ctx.fillText('AK', cX, cY)
    if highlight != 'HI'
      [cX, cY] = @locCenterOnMap('HI')
      ctx.font = 12 + 'px sans-serif'
      ctx.fillStyle = '#eee'
      ctx.fillText('HI', cX, cY)
    if @locations == STATES
      ctx.font = 12 * Math.max(0.7, w / 1000) + 'px sans-serif'
      ctx.fillStyle = '#eee'
      wx = w/3
      if w < 600
        wx = w/5
      ctx.fillText('NOTE: %ILI is not meaningfully comparable between states,', wx, h-24-12 * Math.max(0.7, w / 1000))
      ctx.fillText('due to differences in reporter types.', wx, h-24)
    return 0

  renderChart: () ->
    if not @chartData?
      return
    [w, h] = [@canvasChart.width(), @canvasChart.height()]
    ctx = @canvasChart[0].getContext('2d')
    ctx.fillStyle = '#ddd'
    ctx.fillRect(0, 0, w, h)
    ctx.fillStyle = '#000'
    ctx.strokeStyle = '#000'
    ctx.setLineDash([1, 0])
    ctx.lineWidth = 0.005 * (w + h) / 2
    line = {
      0: (x, y) -> ctx.moveTo(x, y),
      1: (x, y) -> ctx.lineTo(x, y),
    }
    padding =
      left: 64
      right: 20
      top: 36
      bottom: 64
    bounds =
      width: w - padding.left - padding.right
      height: h - padding.top - padding.bottom
    numWeeks = @chartData.length
    for row in @chartData
      maxILI = Math.max(maxILI ? row.value, row.value)
    maxILI = Math.round(maxILI + 1)
    i2x = (i) -> padding.left + bounds.width * i / (numWeeks - 1)
    ili2y = (ili) -> padding.top + bounds.height * (1 - ili / maxILI)
    trace = (xx, yy) ->
      ln = 0
      ctx.beginPath()
      for _i in [0...xx.length]
        line[ln](xx[_i], yy[_i])
        ln |= 1
      ctx.stroke()
    write = (txt, x, y, angle) ->
      ht = ctx.measureText('W').width  # good enough
      wt = ctx.measureText(txt).width
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(angle * Math.PI * 2)
      ctx.translate(-wt / 2, +ht / 2)
      ctx.fillText(txt, 0, 0)
      ctx.restore()
    # axes
    trace([0, numWeeks - 1].map(i2x), [0, 0].map(ili2y))
    trace([0, 0].map(i2x), [0, maxILI].map(ili2y))
    # axis labels
    ctx.font = '16px sans-serif'
    write('Time (weeks)', w / 2, h - padding.bottom / 3, 0)
    prefix = if @chartData[0].location.length > 2 then 'Weighted ' else ''
    write(prefix + '%ILI', padding.left / 3, h / 2, -0.25)
    ctx.font = '12px sans-serif'
    # y-ticks
    for ili in [0..maxILI]
      y = ili2y(ili)
      trace([padding.left - 6, padding.left], [y, y])
      if bounds.height / maxILI >= 32 or ili % 2 == 0
        write(ili, 3 * padding.left / 4, y, 0)
    # x-ticks (only for weeks 20 and 40)
    for i in (i for i in [0...numWeeks - 10]).concat([numWeeks - 1])
      wk = (@chartData[i].epiweek % 100)
      if wk == 20 or wk == 40 or i == (numWeeks - 1)
        x = i2x(i)
        trace([x, x], [h - padding.bottom, h - (padding.bottom - 6)])
        yr = (Math.round(@chartData[i].epiweek / 100) % 100)
        yr = ('00' + yr).slice(-2)
        wk = ('00' + wk).slice(-2)
        write("'#{yr}w#{wk}", x, h - 2 * padding.bottom / 3, -0.125)
    # ILI over time
    ctx.lineWidth = ctx.lineWidth/2
    iVals = (i for i in [0...numWeeks])
    if @truthData?
      iliVals = (@truthData[i].wili for i in [0...(numWeeks-10)])
      trace(iVals.map(i2x), iliVals.map(ili2y))
    ctx.strokeStyle = '#FF0000'
    iliVals = (@chartData[i].value for i in [0...numWeeks])
    trace(iVals.map(i2x), iliVals.map(ili2y))
    #baseline
    loc = @chartData[0].location
    if loc in HHS_REGIONS or loc == 'nat'
      ctx.strokeStyle = '#008080'
      ctx.setLineDash([5, 3])
      for i in [0...numWeeks]
        wk = (@chartData[i].epiweek % 100)
        if wk == 40
          yr = (Math.round(@chartData[i].epiweek / 100))
          ilibase = baselinedata[loc][yr]
          if ilibase?
            ctx.beginPath()
            ctx.moveTo(i2x(i), ili2y(ilibase))
            if i + 32 < numWeeks
              ctx.lineTo(i2x(i+32), ili2y(ilibase))
            else
              ctx.lineTo(i2x(numWeeks-1), ili2y(ilibase))
            ctx.stroke()
    ctx.setLineDash([1, 0])
    ctx.strokeStyle = 'green'
    # credible interval
    current = @chartData[numWeeks-1]
    centerX = i2x(numWeeks-1)
    centerY = ili2y(current.value)
    [upY, downY] = [ili2y(current.value+current.std), ili2y(current.value-current.std)]
    ctx.beginPath()
    ctx.moveTo(centerX, upY)
    ctx.lineTo(centerX, downY)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(i2x(numWeeks-3), upY)
    ctx.lineTo(2*centerX-i2x(numWeeks-3), upY)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(i2x(numWeeks-3), downY)
    ctx.lineTo(2*centerX-i2x(numWeeks-3), downY)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(centerX, centerY, 2, 0, 2 * Math.PI, false)
    ctx.fillStyle = 'green'
    ctx.fill()
    ctx.strokeStyle = '#FF0000'
    ctx.fillStyle = '#000'
    # title and legend
    ctx.font = 12 * Math.min(1, w / 500) + 'px sans-serif'
    ctx.lineWidth = ctx.lineWidth/2
    write("Nowcast", w - 3*padding.right, padding.top, 0)
    ctx.beginPath();
    ctx.moveTo(w - 6*padding.right,padding.top);
    ctx.lineTo(w - 5*padding.right,padding.top);
    ctx.stroke();
    if @truthData?
      ctx.strokeStyle = '#000'
      write("Ground Truth", w - 3*padding.right, (3/2)*padding.top, 0)
      ctx.beginPath()
      ctx.moveTo(w - 6*padding.right,(3/2)*padding.top)
      ctx.lineTo(w - 5*padding.right,(3/2)*padding.top)
      ctx.stroke()
    if loc in HHS_REGIONS or loc == 'nat'
      ctx.strokeStyle = '#008080'
      ctx.setLineDash([5, 3])
      write("CDC Baseline", w - 3*padding.right, (2)*padding.top, 0)
      ctx.beginPath()
      ctx.moveTo(w - 6*padding.right,(2)*padding.top)
      ctx.lineTo(w - 5*padding.right,(2)*padding.top)
      ctx.stroke()
    ctx.font = 24 * Math.min(1, w / 500) + 'px sans-serif'
    write("Historical Nowcasts (out-of-sample)", w / 2, padding.top / 2, 0)

  hitTest: (u, v) ->
    for loc in @locations
      for poly in geodata.locations[loc].paths
        hit = false
        [u1, v1] = @ecef2ortho(geodata.points[poly[0]]...)
        for idx in [1..poly.length]
          [u2, v2] = @ecef2ortho(geodata.points[poly[idx % poly.length]]...)
          if ((v1 > v) != (v2 > v)) and ((u1 > u) or (u2 > u)) and (((u1 > u) and (u2 > u)) or (u1 + (v - v1) * (u2 - u1) / (v2 - v1) > u))
            hit = !hit
          [u1, v1] = [u2, v2]
        if hit
          return loc
    return null

  locCenterOnMap: (loc) ->
    [centerX, centerY, k] = [0, 0, 0]
    for poly in geodata.locations[loc].paths
      for idx in [1..poly.length]
        [x, y] = @ecef2ortho(geodata.points[poly[idx % poly.length]]...)
        [centerX, centerY] = [centerX + x, centerY + y]
        k++
    [centerX, centerY] = [centerX/k, centerY/k]
    if loc == 'AK'
      centerY = centerY - 10
    return [centerX, centerY]

  fetchNowcast: (loc) ->
    @chartData = null
    @truthData = null
    callback = (epidata) => @onNowcastReceived(epidata)
    Epidata_nowcast_single(getEpidataHander(callback), loc)

  onNowcastReceived: (epidata) ->
    current = epidata[epidata.length - 1]
    start = epidata[0]
    loc = current.location
    if loc in REGIONS or loc in NATIONAL
      callback = (ilidata) => @onFluviewReceived(ilidata)
      Epidata_fluview_single(getEpidataHander(callback), loc, start.epiweek+ "-" + current.epiweek)
    ili = '' + (Math.round(current.value * 100) / 100)
    if '.' in ili
      ili += '00'
      idx = ili.indexOf('.')
      ili = ili.slice(0, idx + 3)
    else
      ili += '.00'
    std = '' + (Math.round(current.std * 100) / 100)
    if '.' in std
      std += '00'
      idx = std.indexOf('.')
      std = std.slice(0, idx + 3)
    else
      std += '.00'
    ili = '(' + ili + '&#177;' + std + ')'
    epiweek = current.epiweek%100
    @chartData = epidata
    $('#nowcast_label').text("ILI nowcast for #{loc} for epi-week #{epiweek}:")
    $('#nowcast_label_left').text("ILI nowcast for #{loc} for epi-week #{epiweek}:")
    $('#nowcast_value').html("#{ili}%")
    $('#nowcast_value_left').html("#{ili}%")
    $('#chart_label').text("Historical ILI nowcasts for #{loc}:")
    $('.location_right').css('display', 'block')
    $('#loading_icon').css('display', 'none')
    @resizeCanvas()

  onFluviewReceived: (ilidata) ->
    @truthData = ilidata
    @resizeCanvas()












