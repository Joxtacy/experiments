local player, enemy

function love.load()
	Object = require("classic")
	local Player = require("player")
	local Enemy = require("enemy")
	Bullet = require("bullet")

	player = Player()
	enemy = Enemy()
	listOfBullets = {}

	score = 0

	local font = love.graphics.newImageFont(
		"outlinefont.png",
		" !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~"
	)
	love.graphics.setFont(font)
end

function love.keypressed(key)
	player:keyPressed(key)
end

function love.update(dt)
	player:update(dt)
	enemy:update(dt)

	for i, v in ipairs(listOfBullets) do
		v:update(dt)

		-- Each bullet checks if there is collision with the enemy
		v:checkCollision(enemy)

		-- If the bullet has the property `dead` and it's true then..
		if v.dead then
			-- Remove it from the list
			table.remove(listOfBullets, i)
		end
	end
end

function love.draw()
	enemy:draw()

	for i, v in ipairs(listOfBullets) do
		v:draw()
	end

	player:draw()

	love.graphics.print("Score: " .. score, 10, 10, 0, 3, 3)
end
