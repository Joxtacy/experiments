local tick = require("tick")

local r1, r2
local sheepImage, sheepDir, sheepSpeed, sheepY
local g = 10 -- gravitational constant
local speedLimit = 500
function love.load()
	sheepImage = love.graphics.newImage("sheep.png")
	sheepDir = 1
	sheepSpeed = 0
	sheepY = 100

	-- love.math.random to get seeded numbers
	-- math.random needs a seed or the randomization is same every time game starts
	love.graphics.setBackgroundColor(1, 1, 1)

	--Create 2 rectangles
	r1 = {
		x = 10,
		y = 100,
		width = 100,
		height = 100,
	}

	r2 = {
		x = 250,
		y = 120,
		width = 150,
		height = 120,
	}
end

--- Checks for collision between two axis-aligned rectangles.
-- @param a Table representing the first rectangle, with fields: x, y, width, height.
-- @param b Table representing the second rectangle, with fields: x, y, width, height.
-- @return boolean True if the rectangles overlap, false otherwise.
function checkCollision(a, b)
	--With locals it's common usage to use underscores instead of camelCasing
	local a_left = a.x
	local a_right = a.x + a.width
	local a_top = a.y
	local a_bottom = a.y + a.height

	local b_left = b.x
	local b_right = b.x + b.width
	local b_top = b.y
	local b_bottom = b.y + b.height

	--If Red's right side is further to the right than Blue's left side.
	if
		a_right > b_left
		--and Red's left side is further to the left than Blue's right side.
		and a_left < b_right
		--and Red's bottom side is further to the bottom than Blue's top side.
		and a_bottom > b_top
		--and Red's top side is further to the top than Blue's bottom side then..
		and a_top < b_bottom
	then
		--There is collision!
		return true
	else
		--If one of these statements is false, return false.
		return false
	end
end

function love.keypressed(key)
	if key == "space" then
		sheepSpeed = -400
	end
end

function love.update(dt)
	tick.update(dt) -- needed for tick to work

	sheepSpeed = sheepSpeed + g * 75 * dt
	if sheepSpeed > speedLimit then
		sheepSpeed = speedLimit
	end

	sheepY = sheepY + sheepSpeed * dt
	if sheepSpeed < 0 then
		sheepDir = -1
	else
		sheepDir = 1
	end

	--Make one of rectangle move
	r1.x = r1.x + 100 * dt
end

function love.draw()
	love.graphics.setColor(1, 1, 1)
	love.graphics.draw(sheepImage, 100, sheepY, 0, 1, sheepDir, sheepImage:getWidth() / 2, sheepImage:getHeight() / 2)

	--We create a local variable called mode
	local mode
	if checkCollision(r1, r2) then
		--If there is collision, draw the rectangles filled
		mode = "fill"
	else
		--else, draw the rectangles as a line
		mode = "line"
	end
	love.graphics.setColor(1, 0, 0)
	love.graphics.rectangle(mode, r1.x, r1.y, r1.width, r1.height)
	love.graphics.setColor(0, 0, 1)
	love.graphics.rectangle(mode, r2.x, r2.y, r2.width, r2.height)
end
